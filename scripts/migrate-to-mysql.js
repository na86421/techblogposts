/* eslint-disable no-console */
// DynamoDB 익스포트 파일(JSONL)을 MySQL로 이관하는 일회성 스크립트.
// 실행: node --env-file=.env scripts/migrate-to-mysql.js
//
// 입력 소스:
//   - 프로젝트 루트의 mock.json
//   - ARCHIVE_DIR(기본 /Users/junki/Desktop/archive/archived)의 *.json
// upsert/skipDuplicates 기반이라 재실행해도 안전(멱등).

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ARCHIVE_DIR =
  process.env.ARCHIVE_DIR || '/Users/junki/Desktop/archive/archived'

// 스키마 VarChar 길이 한계 (초과 시 스킵)
const MAX = { id: 600, title: 600, company: 300, uid: 150 }

// DynamoDB 타입 디스크립터(S/N/BOOL) → 평문 객체
function unmarshal(item) {
  const doc = {}

  for (const [key, value] of Object.entries(item)) {
    if ('S' in value) doc[key] = value.S
    else if ('N' in value)
      doc[key] = value.N // BigInt 변환은 호출부에서
    else if ('BOOL' in value) doc[key] = value.BOOL
    else doc[key] = value
  }

  return doc
}

function collectFiles() {
  const files = []
  const mockPath = path.join(process.cwd(), 'mock.json')

  if (fs.existsSync(mockPath)) files.push(mockPath)

  if (fs.existsSync(ARCHIVE_DIR)) {
    for (const f of fs.readdirSync(ARCHIVE_DIR)) {
      if (f.endsWith('.json') || f.endsWith('.json.gz')) {
        files.push(path.join(ARCHIVE_DIR, f))
      }
    }
  }

  return files
}

function* readDocs(files) {
  for (const file of files) {
    const buf = fs.readFileSync(file)
    const content = file.endsWith('.gz')
      ? zlib.gunzipSync(buf).toString('utf-8')
      : buf.toString('utf-8')
    const lines = content.split('\n').filter(Boolean)

    for (const line of lines) {
      let parsed

      try {
        parsed = JSON.parse(line)
      } catch {
        continue
      }

      if (parsed && parsed.Item) yield unmarshal(parsed.Item)
    }
  }
}

async function createInChunks(label, model, rows, chunkSize = 500) {
  let inserted = 0

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const result = await model.createMany({
      data: chunk,
      skipDuplicates: true,
    })

    inserted += result.count
  }

  console.log(`  ${label}: ${inserted} inserted (${rows.length} candidates)`)

  return inserted
}

async function main() {
  const files = collectFiles()

  console.log(`소스 파일 ${files.length}개:`)
  files.forEach((f) => console.log(`  - ${f}`))

  const posts = new Map() // id -> doc
  const blogs = new Map() // id -> doc
  const bookmarks = new Map() // `${uid}-${parent}` -> doc
  const skipped = []

  for (const doc of readDocs(files)) {
    if (doc.dataType === 'post') posts.set(doc.id, doc)
    else if (doc.dataType === 'blog') blogs.set(doc.id, doc)
    else if (doc.dataType === 'bookmark')
      bookmarks.set(`${doc.uid}-${doc.parent}`, doc)
  }

  console.log(
    `\n파싱 결과 — posts: ${posts.size}, blogs: ${blogs.size}, bookmarks: ${bookmarks.size}`,
  )

  // posts
  const postRows = []

  for (const p of posts.values()) {
    const id = (p.id || '').trim()
    const title = (p.title || '').trim()
    const company = (p.company || '').trim()

    if (
      id.length > MAX.id ||
      title.length > MAX.title ||
      company.length > MAX.company
    ) {
      skipped.push({ type: 'post', id, reason: 'length' })
      continue
    }

    postRows.push({
      id,
      title,
      company,
      publishDate: BigInt(p.publishDate || 0),
      viewCount: Number(p.viewCount || 0),
      isShow: typeof p.isShow === 'boolean' ? p.isShow : true,
    })
  }

  // blogs
  const blogRows = []

  for (const b of blogs.values()) {
    const id = (b.id || '').trim()

    if (id.length > MAX.id) {
      skipped.push({ type: 'blog', id, reason: 'length' })
      continue
    }

    blogRows.push({
      id,
      title: (b.title || '').trim(),
      rssURL: (b.rssURL || '').trim(),
      cron: typeof b.cron === 'boolean' ? b.cron : false,
      lastUpdated: BigInt(b.lastUpdated || 0),
      lastUpdatedDate: (b.lastUpdatedDate || '').trim(),
    })
  }

  console.log('\n적재 시작...')
  await createInChunks('posts', prisma.post, postRows)
  await createInChunks('blogs', prisma.blog, blogRows)

  // bookmarks — parent 글이 존재하는 것만 (FK 위반 방지)
  const validPostIds = new Set(postRows.map((r) => r.id))
  const bookmarkRows = []

  for (const bm of bookmarks.values()) {
    const uid = (bm.uid || '').trim()
    const parent = (bm.parent || '').trim()

    if (!validPostIds.has(parent)) {
      skipped.push({
        type: 'bookmark',
        id: `${uid}-${parent}`,
        reason: 'orphan',
      })
      continue
    }

    if (uid.length > MAX.uid || parent.length > MAX.id) {
      skipped.push({
        type: 'bookmark',
        id: `${uid}-${parent}`,
        reason: 'length',
      })
      continue
    }

    bookmarkRows.push({
      uid,
      parent,
      publishDate: BigInt(bm.publishDate || 0),
    })
  }

  await createInChunks('bookmarks', prisma.bookmark, bookmarkRows)

  if (skipped.length) {
    console.log(`\n⚠️  스킵 ${skipped.length}건:`)
    const byReason = skipped.reduce((acc, s) => {
      acc[s.reason] = (acc[s.reason] || 0) + 1

      return acc
    }, {})

    console.log(`  ${JSON.stringify(byReason)}`)
    skipped
      .slice(0, 20)
      .forEach((s) => console.log(`  - [${s.type}/${s.reason}] ${s.id}`))
  }

  console.log('\n✅ 이관 완료')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (err) => {
    await prisma.$disconnect()
    console.error('❌ 이관 실패:', err)
    process.exit(1)
  })
