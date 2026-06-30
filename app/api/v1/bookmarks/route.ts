import { prisma } from '@/libs/prisma/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid') ?? ''

  const rows = await prisma.bookmark.findMany({
    where: { uid },
    select: { parent: true, publishDate: true },
    take: 100,
  })

  const bookmarks = rows.map((row) => ({
    parent: row.parent,
    publishDate: Number(row.publishDate),
  }))

  return NextResponse.json({ bookmarks })
}
