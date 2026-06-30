import { prisma } from '@/libs/prisma/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  const { uid, parent } = await request.json()

  await prisma.bookmark.upsert({
    where: { uid_parent: { uid, parent } },
    create: { uid, parent, publishDate: BigInt(Date.now()) },
    update: {},
  })

  return new Response(null, { status: 204 })
}

export async function DELETE(request: Request) {
  const { uid, parent } = await request.json()

  await prisma.bookmark.deleteMany({
    where: { uid, parent },
  })

  return new Response(null, { status: 204 })
}
