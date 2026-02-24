import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OverlapBanner } from '@/components/overlap-banner'
import { formatDuration, formatDate } from '@/lib/utils'
import { formatMoney } from '@/lib/currencies'
import { DollarSign, Clock, AlertTriangle, Activity, Zap } from 'lucide-react'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import { RealtimeTracker } from './_components/realtime-tracker'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  const userId = session.user.id
  const now = new Date()

  const [subscriptions, alerts, monthlyUsage, todayUsage] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId, isDeleted: false, isActive: true },
    }),
    prisma.overlapAlert.findMany({
      where: { userId, dismissed: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.usageLog.findMany({
      where: {
        userId,
        date: { gte: startOfMonth(now), lte: endOfMonth(now) },
      },
    }),
    prisma.usageLog.findMany({
      where: {
        userId,
        date: { gte: startOfDay(now), lte: endOfDay(now) },
      },
    }),
  ])

  const totalMonthlySpend = subscriptions.reduce((sum, s) => {
    const cost = Number(s.cost)
    return sum + (s.billingCycle === 'YEARLY' ? cost / 12 : cost)
  }, 0)

  const todaySeconds = todayUsage.reduce((sum, l) => sum + l.durationSeconds, 0)
  const monthSeconds = monthlyUsage.reduce((sum, l) => sum + l.durationSeconds, 0)

  const topTool = monthlyUsage.reduce<Record<string, number>>((acc, l) => {
    acc[l.tool] = (acc[l.tool] ?? 0) + l.durationSeconds
    return acc
  }, {})

  const topToolName = Object.entries(topTool).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  const recentLogs = await prisma.usageLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name?.split(' ')[0] ?? 'there'}</p>
      </div>

      {/* Overlap alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <OverlapBanner
              key={alert.id}
              id={alert.id}
              type={alert.type}
              description={alert.description}
              potentialSavings={Number(alert.potentialSavings)}
              currency={session.user.currency}
            />
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalMonthlySpend, session.user.currency)}</div>
            <p className="text-xs text-muted-foreground">{subscriptions.length} active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Usage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(todaySeconds)}</div>
            <p className="text-xs text-muted-foreground">across AI tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overlap Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">potential savings detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Tool</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topToolName ?? '—'}</div>
            <p className="text-xs text-muted-foreground">
              {monthSeconds > 0 ? `${formatDuration(monthSeconds)} this month` : 'No usage yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Live tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Currently Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RealtimeTracker />
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <Zap className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No activity yet</p>
                <p className="text-xs text-muted-foreground">Install the Chrome extension to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{log.tool}</Badge>
                      <span className="text-sm text-muted-foreground">{log.feature}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDuration(log.durationSeconds)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
