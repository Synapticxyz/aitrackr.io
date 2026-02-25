import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const today = new Date()
  const dateFilter = { gte: startOfDay(today), lte: endOfDay(today) }
  const where = { userId: session.user.id, date: dateFilter }

  const [aggregate, byToolRows, sessionCountRows] = await Promise.all([
    prisma.usageLog.aggregate({
      where,
      _sum: { durationSeconds: true },
    }),
    prisma.usageLog.groupBy({
      by: ['tool'],
      where,
      _sum: { durationSeconds: true },
      orderBy: { _sum: { durationSeconds: 'desc' } },
    }),
    prisma.usageLog.groupBy({
      by: ['sessionId'],
      where,
    }),
  ])

  const totalSeconds = aggregate._sum.durationSeconds ?? 0
  const byTool = Object.fromEntries(
    byToolRows.map((r) => [r.tool, r._sum.durationSeconds ?? 0])
  )
  const topTool = byToolRows[0]?.tool ?? null

  return NextResponse.json({
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    byTool,
    topTool,
    sessionCount: sessionCountRows.length,
    updatedAt: new Date().toISOString(),
  })
}
