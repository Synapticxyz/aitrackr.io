import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-cache'
import { OverlapBanner } from '@/components/overlap-banner'
import { formatDuration, formatDate } from '@/lib/utils'
import { formatMoney } from '@/lib/currencies'
import { Banknote, Clock, AlertTriangle, Activity, Zap } from 'lucide-react'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import { RealtimeTracker } from './_components/realtime-tracker'
import { RunAnalysisButton } from './_components/run-analysis-button'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/auth/signin')

  const userId = session.user.id
  const now = new Date()

  const [subscriptions, alerts, monthlyUsage, todayUsage, recentLogs] = await Promise.all([
    prisma.subscription.findMany({ where: { userId, isDeleted: false, isActive: true }, select: { id: true, name: true, cost: true, billingCycle: true } }),
    prisma.overlapAlert.findMany({ where: { userId, dismissed: false }, orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, type: true, description: true, potentialSavings: true } }),
    prisma.usageLog.findMany({ where: { userId, date: { gte: startOfMonth(now), lte: endOfMonth(now) } }, select: { tool: true, durationSeconds: true } }),
    prisma.usageLog.findMany({ where: { userId, date: { gte: startOfDay(now), lte: endOfDay(now) } }, select: { durationSeconds: true } }),
    prisma.usageLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8, select: { id: true, tool: true, feature: true, durationSeconds: true, date: true } }),
  ])

  const totalMonthlySpend = subscriptions.reduce((sum, s) => {
    const cost = Number(s.cost)
    return sum + (s.billingCycle === 'YEARLY' ? cost / 12 : cost)
  }, 0)
  const todaySeconds = todayUsage.reduce((sum, l) => sum + l.durationSeconds, 0)
  const monthSeconds = monthlyUsage.reduce((sum, l) => sum + l.durationSeconds, 0)
  const topTool = monthlyUsage.reduce<Record<string, number>>((acc, l) => { acc[l.tool] = (acc[l.tool] ?? 0) + l.durationSeconds; return acc }, {})
  const topToolName = Object.entries(topTool).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  const statCards = [
    { label: 'MONTHLY_SPEND', value: formatMoney(totalMonthlySpend, session.user.currency), sub: `${subscriptions.length} active subscriptions`, icon: Banknote, amber: true },
    { label: 'TODAY_USAGE', value: formatDuration(todaySeconds), sub: 'across AI tools', icon: Clock, amber: false },
    { label: 'OVERLAP_ALERTS', value: String(alerts.length), sub: 'potential savings detected', icon: AlertTriangle, amber: alerts.length > 0 },
    { label: 'TOP_TOOL', value: topToolName ?? '—', sub: monthSeconds > 0 ? `${formatDuration(monthSeconds)} this month` : 'No usage yet', icon: Activity, amber: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500">// OVERVIEW</p>
          <h1 className="text-2xl font-bold font-mono text-white mt-1">DASHBOARD</h1>
          <p className="text-sm text-gray-400 font-mono">Welcome back, {session.user.name?.split(' ')[0] ?? 'there'}</p>
        </div>
        <RunAnalysisButton />
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <OverlapBanner key={alert.id} id={alert.id} type={alert.type} description={alert.description} potentialSavings={Number(alert.potentialSavings)} currency={session.user.currency} />
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-white/5 border border-white/10">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-[#0A0A0A] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-gray-500">{card.label}</p>
                <Icon className="h-3.5 w-3.5 text-gray-600" />
              </div>
              <p className={`text-2xl font-bold font-mono ${card.amber ? 'text-amber-500' : 'text-white'}`}>{card.value}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">{card.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Live tracker */}
        <div className="border border-white/10 bg-[#111111]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
            <p className="text-xs font-mono font-bold text-white">LIVE_TRACKING</p>
          </div>
          <div className="p-5">
            <RealtimeTracker />
          </div>
        </div>

        {/* Recent activity */}
        <div className="border border-white/10 bg-[#111111]">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-mono font-bold text-white">RECENT_ACTIVITY</p>
          </div>
          <div className="p-5">
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <Zap className="h-6 w-6 text-gray-700" />
                <p className="text-xs font-mono text-gray-500">NO_ACTIVITY_YET</p>
                <p className="text-xs font-mono text-gray-600">Install the Chrome extension to start tracking</p>
              </div>
            ) : (
              <div className="space-y-0">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">{log.tool}</span>
                      <span className="text-xs text-gray-500 font-mono">{log.feature}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-white">{formatDuration(log.durationSeconds)}</p>
                      <p className="text-xs font-mono text-gray-600">{formatDate(log.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
