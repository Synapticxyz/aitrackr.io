import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  })
  if (!dbUser?.isAdmin) return errors.forbidden()

  const [auditLogs, recentUsage, recentSignups] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { user: { select: { email: true } } },
    }),
    prisma.usageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { user: { select: { email: true } } },
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, name: true, createdAt: true, subscriptionStatus: true },
    }),
  ])

  return NextResponse.json({ auditLogs, recentUsage, recentSignups })
}
