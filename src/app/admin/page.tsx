'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Users, TrendingUp, Activity, CreditCard,
  AlertTriangle, Database, MessageSquare, RefreshCw
} from 'lucide-react'

interface AdminStats {
  users: {
    total: number
    pro: number
    free: number
    deleted: number
    newLast30Days: number
    newLast7Days: number
  }
  usage: {
    totalLogs: number
    logsLast30Days: number
  }
  subscriptions: {
    total: number
    active: number
  }
  alerts: {
    total: number
    unresolved: number
  }
  other: {
    auditLogs: number
    toolSuggestions: number
  }
  topTools: Array<{ tool: string; sessions: number; totalSeconds: number }>
  charts: {
    signupsPerDay: Array<{ date: string; count: number }>
    usagePerDay: Array<{ date: string; count: number }>
  }
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = false,
}: {
  title: string
  value: number | string
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  accent?: boolean
}) {
  return (
    <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[#555] text-xs tracking-widest">{title}</span>
        <Icon className={`w-4 h-4 ${accent ? 'text-amber-500' : 'text-[#333]'}`} />
      </div>
      <div className={`text-2xl font-bold ${accent ? 'text-amber-500' : 'text-[#E0E0E0]'}`}>
        {value}
      </div>
      {sub && <p className="text-[#444] text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setStats(data)
      setLastRefresh(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const formatHours = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const chartTooltipStyle = {
    backgroundColor: '#111',
    border: '1px solid #1A1A1A',
    borderRadius: '4px',
    color: '#E0E0E0',
    fontFamily: 'monospace',
    fontSize: '11px',
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#E0E0E0] text-lg font-bold tracking-wider">OVERVIEW</h1>
          <p className="text-[#444] text-xs mt-1">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 border border-[#2A2A2A] rounded text-xs text-[#888] hover:text-amber-500 hover:border-amber-500/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          REFRESH
        </button>
      </div>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 rounded p-3 text-red-400 text-sm">
          ERROR: {error}
        </div>
      )}

      {loading && !stats ? (
        <div className="text-[#444] text-sm animate-pulse tracking-widest">LOADING_STATS...</div>
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="TOTAL_USERS"
              value={stats.users.total}
              sub={`+${stats.users.newLast30Days} last 30d`}
              icon={Users}
              accent
            />
            <StatCard
              title="PRO_USERS"
              value={stats.users.pro}
              sub={`${stats.users.total > 0 ? Math.round((stats.users.pro / stats.users.total) * 100) : 0}% conversion`}
              icon={TrendingUp}
            />
            <StatCard
              title="USAGE_SESSIONS"
              value={stats.usage.logsLast30Days.toLocaleString()}
              sub="last 30 days"
              icon={Activity}
            />
            <StatCard
              title="ACTIVE_SUBS"
              value={stats.subscriptions.active}
              sub={`${stats.subscriptions.total} total`}
              icon={CreditCard}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="NEW_7_DAYS"
              value={stats.users.newLast7Days}
              sub="new signups"
              icon={Users}
            />
            <StatCard
              title="OPEN_ALERTS"
              value={stats.alerts.unresolved}
              sub={`${stats.alerts.total} total overlap alerts`}
              icon={AlertTriangle}
            />
            <StatCard
              title="AUDIT_LOGS"
              value={stats.other.auditLogs.toLocaleString()}
              sub="GDPR actions"
              icon={Database}
            />
            <StatCard
              title="TOOL_SUGGESTIONS"
              value={stats.other.toolSuggestions}
              sub="user-submitted tools"
              icon={MessageSquare}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Signups per day */}
            <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
              <h2 className="text-[#888] text-xs tracking-widest mb-4">SIGNUPS_PER_DAY (30d)</h2>
              {stats.charts.signupsPerDay.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-[#333] text-xs">NO_DATA</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={stats.charts.signupsPerDay}>
                    <defs>
                      <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(v: string) => v.slice(5)}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fill="url(#signupGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Usage sessions per day */}
            <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
              <h2 className="text-[#888] text-xs tracking-widest mb-4">USAGE_SESSIONS_PER_DAY (30d)</h2>
              {stats.charts.usagePerDay.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-[#333] text-xs">NO_DATA</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={stats.charts.usagePerDay}>
                    <defs>
                      <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(v: string) => v.slice(5)}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#usageGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* PRO vs FREE chart + Top tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PRO vs FREE */}
            <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
              <h2 className="text-[#888] text-xs tracking-widest mb-4">USER_BREAKDOWN</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={[
                    { label: 'FREE', count: stats.users.free },
                    { label: 'PRO', count: stats.users.pro },
                    { label: 'DELETED', count: stats.users.deleted },
                  ]}
                  barSize={48}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top tools */}
            <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
              <h2 className="text-[#888] text-xs tracking-widest mb-4">TOP_TOOLS (30d)</h2>
              {stats.topTools.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-[#333] text-xs">NO_USAGE_DATA</div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {stats.topTools.map((t, i) => (
                    <div key={t.tool} className="flex items-center gap-3">
                      <span className="text-[#333] text-xs w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[#888] text-xs truncate">{t.tool}</span>
                          <span className="text-[#555] text-xs ml-2 flex-shrink-0">
                            {t.sessions} sessions · {formatHours(Number(t.totalSeconds))}
                          </span>
                        </div>
                        <div className="h-0.5 bg-[#1A1A1A] rounded overflow-hidden">
                          <div
                            className="h-full bg-amber-500/60 rounded"
                            style={{
                              width: `${Math.round((t.sessions / (stats.topTools[0]?.sessions || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="text-[#333] text-xs tracking-wider">
            TOTAL_USAGE_ALL_TIME: {stats.usage.totalLogs.toLocaleString()} sessions
          </div>
        </>
      ) : null}
    </div>
  )
}
