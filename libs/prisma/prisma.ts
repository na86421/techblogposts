import { PrismaClient } from '@prisma/client'

// Next.js dev 핫리로드 시 PrismaClient 인스턴스가 누적되어
// 커넥션이 고갈되는 것을 막기 위한 글로벌 싱글톤 패턴
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
