import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { sendDataExportEmail } from '@/lib/email'

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const [user, subscriptions, usageLogs, overlapAlerts, auditLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        timezone: true,
        subscriptionStatus: true,
        emailPreferences: true,
      },
    }),
    prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.usageLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
    }),
    prisma.overlapAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.auditLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Mark export requested
  await prisma.user.update({
    where: { id: session.user.id },
    data: { dataExportRequestedAt: new Date() },
  })

  // Log to audit
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'EXPORT_DATA',
      metadata: { requestedAt: new Date().toISOString() },
    },
  })

  // Send confirmation email
  if (user?.email) {
    await sendDataExportEmail(user.email, user.name ?? 'there')
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    gdprNote: 'This export contains all personal data held by AiTrackr in accordance with GDPR Article 20.',
    user,
    subscriptions,
    usageLogs,
    overlapAlerts,
    auditLogs,
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="aitrackr-export-${session.user.id}.json"`,
    },
  })
}
