import { prisma } from '@/libs/prisma/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { id } = await request.json()

  // 글이 없을 수 있으니 updateMany로 (없으면 count 0, 예외 없음)
  await prisma.post.updateMany({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })

  return new Response(null, { status: 201 })
}
