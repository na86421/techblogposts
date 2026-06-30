import { prisma } from '@/libs/prisma/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') ?? ''

  const rows = await prisma.post.findMany({
    where: {
      isShow: true,
      OR: [{ title: { contains: query } }, { company: { contains: query } }],
    },
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
