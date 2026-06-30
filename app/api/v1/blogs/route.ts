import { prisma } from '@/libs/prisma/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.blog.findMany({
    where: { cron: true },
    orderBy: { lastUpdated: 'desc' },
    take: 200,
  })

  const blogs = rows.map((row) => ({
    id: row.id,
    title: row.title,
    rssURL: row.rssURL,
    cron: row.cron,
    lastUpdated: Number(row.lastUpdated),
    lastUpdatedDate: row.lastUpdatedDate,
  }))

  return NextResponse.json({ blogs })
}
