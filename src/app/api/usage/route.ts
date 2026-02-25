import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { usageLogSchema } from '@/lib/validations'
import { errors } from '@/lib/api-error'
import { usageRateLimit, generalRateLimit } from '@/lib/rate-limit'
import { corsHeaders, handleCorsOptions, withCors } from '@/lib/cors'
import { startOfDay, endOfDay, subDays } from 'date-fns'

// POST — receives data from Chrome extension (API key auth)
export async function POST(request: NextRequest) {
  const corsOpts = handleCorsOptions(request)
  if (corsOpts) return corsOpts

  const origin = request.headers.get('origin')
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return withCors(errors.invalidApiKey(), origin)
  }

  // Validate API key
  const user = await prisma.user.findUnique({
    where: { apiKey },
    select: { id: true, deletedAt: true },
  })

  if (!user || user.deletedAt) {
    return withCors(errors.invalidApiKey(), origin)
  }

  // Rate limiting per API key
  const rateLimit = usageRateLimit(apiKey)
  if (!rateLimit.success) {
    return withCors(errors.rateLimited(rateLimit.reset), origin)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return withCors(errors.validation('Invalid JSON body'), origin)
  }

  const parsed = usageLogSchema.safeParse(body)
  if (!parsed.success) {
    return withCors(
      errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed'),
      origin
    )
  }

  const { tool, model, feature, durationSeconds, sessionId, timestamp } = parsed.data

  try {
    const log = await prisma.usageLog.create({
      data: {
        userId: user.id,
        tool,
        model,
        feature,
        durationSeconds,
        sessionId,
        date: new Date(timestamp),
      },
    })

    const response = NextResponse.json({ success: true, id: log.id }, { status: 201 })
    return withCors(response, origin)
  } catch {
    return withCors(errors.internal(), origin)
  }
}

// GET — query usage history (session auth, dashboard)
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const rateLimit = generalRateLimit(session.user.id)
  if (!rateLimit.success) return errors.rateLimited(rateLimit.reset)

  const { searchParams } = new URL(request.url)
  const daysParam = searchParams.get('days') ?? '30'
  const groupBy = searchParams.get('groupBy') ?? 'tool'
  const days = Math.min(parseInt(daysParam, 10) || 30, 365)

  const from = startOfDay(subDays(new Date(), days - 1))
  const to = endOfDay(new Date())

  const dateFilter = { gte: from, lte: to }

  if (groupBy === 'tool') {
    const rows = await prisma.usageLog.groupBy({
      by: ['tool'],
      where: { userId: session.user.id, date: dateFilter },
      _sum: { durationSeconds: true },
      orderBy: { _sum: { durationSeconds: 'desc' } },
    })
    const grouped = Object.fromEntries(
      rows.map((r) => [r.tool, r._sum.durationSeconds ?? 0])
    )
    return NextResponse.json({ grouped })
  }

  if (groupBy === 'date') {
    const rows = await prisma.usageLog.groupBy({
      by: ['date'],
      where: { userId: session.user.id, date: dateFilter },
      _sum: { durationSeconds: true },
      orderBy: { date: 'asc' },
    })
    const grouped = Object.fromEntries(
      rows.map((r) => [
        new Date(r.date).toISOString().split('T')[0]!,
        r._sum.durationSeconds ?? 0,
      ])
    )
    return NextResponse.json({ grouped })
  }

  const logs = await prisma.usageLog.findMany({
    where: { userId: session.user.id, date: dateFilter },
    orderBy: { date: 'desc' },
    take: 100,
  })
  return NextResponse.json({ logs })
}
