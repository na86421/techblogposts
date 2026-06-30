import { prisma } from '@/libs/prisma/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')

  // 커서 형식: `${publishDate}:${id}` — id가 URL(콜론 포함)이라 첫 콜론 기준으로 분리
  let cursorFilter = {}

  if (cursor) {
    const separatorIndex = cursor.indexOf(':')
    const publishDate = BigInt(cursor.slice(0, separatorIndex))
    const id = cursor.slice(separatorIndex + 1)

    cursorFilter = {
      OR: [
        { publishDate: { lt: publishDate } },
        { AND: [{ publishDate }, { id: { gt: id } }] },
      ],
    }
  }

  const rows = await prisma.post.findMany({
    where: { isShow: true, ...cursorFilter },
    orderBy: [{ publishDate: 'desc' }, { id: 'asc' }],
    take: PAGE_SIZE,
  })

  const posts = rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    publishDate: Number(row.publishDate),
    viewCount: row.viewCount,
    isShow: row.isShow,
  }))

  // 다음 페이지가 있을 때만 커서 반환 (없으면 undefined → 무한스크롤 종료)
  const lastRow = rows[rows.length - 1]
  const nextCursor =
    rows.length === PAGE_SIZE && lastRow
      ? `${lastRow.publishDate}:${lastRow.id}`
      : undefined

  return NextResponse.json({ posts, cursor: nextCursor })
}
