import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRenewalAlertEmail } from '@/lib/email'
import { addDays, startOfDay, endOfDay } from 'date-fns'

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

  // Find subscriptions renewing in exactly 3 days
  const targetDate = addDays(new Date(), 3)

  const subscriptions = await prisma.subscription.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      nextBillingDate: {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate),
      },
    },
    include: {
      user: {
        select: { email: true, name: true, emailPreferences: true, deletedAt: true },
      },
    },
  })

  let sent = 0
  for (const sub of subscriptions) {
    if (sub.user.deletedAt) continue

    const prefs = sub.user.emailPreferences as { renewalAlerts?: boolean }
    if (!prefs?.renewalAlerts) continue

    const ok = await sendRenewalAlertEmail(
      sub.user.email,
      sub.name,
      Number(sub.cost),
      sub.nextBillingDate
    )
    if (ok) sent++
  }

  return NextResponse.json({
    success: true,
    processed: subscriptions.length,
    emailsSent: sent,
    timestamp: new Date().toISOString(),
  })
}
