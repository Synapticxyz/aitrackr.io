import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const today = new Date()
  const logs = await prisma.usageLog.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
  })

  const totalSeconds = logs.reduce((sum, l) => sum + l.durationSeconds, 0)

  const byTool = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.tool] = (acc[log.tool] ?? 0) + log.durationSeconds
    return acc
  }, {})

  const topTool = Object.entries(byTool).sort((a, b) => b[1] - a[1])[0]

  return NextResponse.json({
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    byTool,
    topTool: topTool ? topTool[0] : null,
    sessionCount: new Set(logs.map((l) => l.sessionId)).size,
    updatedAt: new Date().toISOString(),
  })
}
