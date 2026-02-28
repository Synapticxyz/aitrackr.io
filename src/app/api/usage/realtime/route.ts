import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { corsHeaders, handleCorsOptions, withCors } from '@/lib/cors'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  const corsOpts = handleCorsOptions(request)
  if (corsOpts) return corsOpts

  const origin = request.headers.get('origin')
  const apiKey = request.headers.get('x-api-key')

  let userId: string | null = null

  if (apiKey) {
    const user = await prisma.user.findUnique({
      where: { apiKey },
      select: { id: true, deletedAt: true },
    })
    if (user && !user.deletedAt) userId = user.id
  }
  if (!userId) {
    const session = await auth()
    if (session?.user) userId = session.user.id
  }
  if (!userId) {
    return withCors(errors.unauthorized(), origin)
  }

  const today = new Date()
  const dateFilter = { gte: startOfDay(today), lte: endOfDay(today) }
  const where = { userId, date: dateFilter }

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

  const response = NextResponse.json({
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    byTool,
    topTool,
    sessionCount: sessionCountRows.length,
    updatedAt: new Date().toISOString(),
  })
  return withCors(response, origin)
}
