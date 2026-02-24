import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { detectOverlaps, saveOverlapAlerts } from '@/lib/overlap-detector'

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const proUsers = await prisma.user.findMany({
    where: {
      subscriptionStatus: 'PRO',
      deletedAt: null,
    },
    select: { id: true },
  })

  let processed = 0
  let totalAlerts = 0

  for (const user of proUsers) {
    try {
      const overlaps = await detectOverlaps(user.id)
      await saveOverlapAlerts(user.id, overlaps)
      processed++
      totalAlerts += overlaps.length
    } catch (err) {
      console.error(`[Cron Overlaps] Failed for user ${user.id}:`, err)
    }
  }

  return NextResponse.json({
    success: true,
    processed,
    totalAlerts,
    timestamp: new Date().toISOString(),
  })
}
