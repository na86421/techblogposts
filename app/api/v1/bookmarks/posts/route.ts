import { prisma } from '@/libs/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid') ?? ''

  const rows = await prisma.post.findMany({
    where: { bookmarks: { some: { uid } } },
    orderBy: { publishDate: 'desc' },
    take: 100,
  })

  const posts = rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    publishDate: Number(row.publishDate),
    viewCount: row.viewCount,
    isShow: row.isShow,
  }))

  return NextResponse.json({ posts })
}
