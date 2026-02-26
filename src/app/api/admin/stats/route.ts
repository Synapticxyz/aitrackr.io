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

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    proUsers,
    freeUsers,
    deletedUsers,
    newUsersLast30,
    newUsersLast7,
    totalUsageLogs,
    usageLogsLast30,
    totalSubscriptions,
    activeSubscriptions,
    totalOverlapAlerts,
    unresolvedAlerts,
    totalAuditLogs,
    toolSuggestions,
    topTools,
    signupsPerDay,
    usagePerDay,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { subscriptionStatus: 'PRO', deletedAt: null } }),
    prisma.user.count({ where: { subscriptionStatus: 'FREE', deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: { not: null } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null } }),
    prisma.usageLog.count(),
    prisma.usageLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.subscription.count({ where: { isDeleted: false } }),
    prisma.subscription.count({ where: { isActive: true, isDeleted: false } }),
    prisma.overlapAlert.count(),
    prisma.overlapAlert.count({ where: { dismissed: false } }),
    prisma.auditLog.count(),
    prisma.toolSuggestion.count(),

    // Top tools by usage in last 30 days
    prisma.usageLog.groupBy({
      by: ['tool'],
      _count: { tool: true },
      _sum: { durationSeconds: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { tool: 'desc' } },
      take: 10,
    }),

    // Signups per day for last 30 days
    prisma.$queryRaw<{ date: string; count: number }[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM users
      WHERE created_at >= ${thirtyDaysAgo}
        AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,

    // Usage sessions per day for last 30 days
    prisma.$queryRaw<{ date: string; count: number }[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM usage_logs
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ])

  return NextResponse.json({
    users: {
      total: totalUsers,
      pro: proUsers,
      free: freeUsers,
      deleted: deletedUsers,
      newLast30Days: newUsersLast30,
      newLast7Days: newUsersLast7,
    },
    usage: {
      totalLogs: totalUsageLogs,
      logsLast30Days: usageLogsLast30,
    },
    subscriptions: {
      total: totalSubscriptions,
      active: activeSubscriptions,
    },
    alerts: {
      total: totalOverlapAlerts,
      unresolved: unresolvedAlerts,
    },
    other: {
      auditLogs: totalAuditLogs,
      toolSuggestions,
    },
    topTools: topTools.map((t) => ({
      tool: t.tool,
      sessions: t._count.tool,
      totalSeconds: t._sum.durationSeconds ?? 0,
    })),
    charts: {
      signupsPerDay,
      usagePerDay,
    },
  })
}
