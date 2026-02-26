'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  createdAt: string
  user: { email: string } | null
  metadata: unknown
}

interface UsageLog {
  id: string
  tool: string
  durationSeconds: number
  createdAt: string
  user: { email: string } | null
}

interface RecentSignup {
  id: string
  email: string
  name: string | null
  createdAt: string
  subscriptionStatus: string
}

interface ActivityData {
  auditLogs: AuditLog[]
  recentUsage: UsageLog[]
  recentSignups: RecentSignup[]
}

export default function AdminActivityPage() {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/activity')
      setData(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#E0E0E0] text-lg font-bold tracking-wider">ACTIVITY</h1>
          <p className="text-[#444] text-xs mt-1">Recent events across the platform</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 border border-[#2A2A2A] rounded text-xs text-[#888] hover:text-amber-500 hover:border-amber-500/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          REFRESH
        </button>
      </div>

      {loading && !data ? (
        <div className="text-[#444] text-sm animate-pulse tracking-widest">LOADING...</div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Signups */}
          <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
            <h2 className="text-[#888] text-xs tracking-widest mb-3">RECENT_SIGNUPS</h2>
            <div className="space-y-2">
              {data.recentSignups.map((u) => (
                <div key={u.id} className="flex items-start justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="text-[#888] truncate">{u.email}</div>
                    <div className="text-[#444]">{formatTime(u.createdAt)}</div>
                  </div>
                  <span className={`flex-shrink-0 px-1.5 py-0.5 rounded tracking-wider text-xs ${
                    u.subscriptionStatus === 'PRO'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-[#111] text-[#555] border border-[#1A1A1A]'
                  }`}>
                    {u.subscriptionStatus}
                  </span>
                </div>
              ))}
              {data.recentSignups.length === 0 && (
                <div className="text-[#333] text-xs">NO_RECENT_SIGNUPS</div>
              )}
            </div>
          </div>

          {/* Audit Log */}
          <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4">
            <h2 className="text-[#888] text-xs tracking-widest mb-3">AUDIT_LOG</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.auditLogs.map((log) => (
                <div key={log.id} className="text-xs border-b border-[#111] pb-2 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-amber-500/80 tracking-wider">{log.action}</span>
                    <span className="text-[#444] flex-shrink-0">{formatTime(log.createdAt)}</span>
                  </div>
                  <div className="text-[#444] mt-0.5 truncate">{log.user?.email ?? 'system'}</div>
                </div>
              ))}
              {data.auditLogs.length === 0 && (
                <div className="text-[#333] text-xs">NO_AUDIT_LOGS</div>
              )}
            </div>
          </div>

          {/* Recent Usage */}
          <div className="border border-[#1A1A1A] rounded bg-[#0D0D0D] p-4 md:col-span-2">
            <h2 className="text-[#888] text-xs tracking-widest mb-3">RECENT_USAGE_SESSIONS</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A]">
                    <th className="text-left pb-2 text-[#444] tracking-widest font-normal pr-6">TOOL</th>
                    <th className="text-left pb-2 text-[#444] tracking-widest font-normal pr-6">DURATION</th>
                    <th className="text-left pb-2 text-[#444] tracking-widest font-normal pr-6">USER</th>
                    <th className="text-left pb-2 text-[#444] tracking-widest font-normal">TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsage.map((log) => (
                    <tr key={log.id} className="border-b border-[#111] last:border-0">
                      <td className="py-2 pr-6 text-[#888]">{log.tool}</td>
                      <td className="py-2 pr-6 text-[#555]">{formatDuration(log.durationSeconds)}</td>
                      <td className="py-2 pr-6 text-[#444] truncate max-w-[160px]">{log.user?.email ?? '—'}</td>
                      <td className="py-2 text-[#333]">{formatTime(log.createdAt)}</td>
                    </tr>
                  ))}
                  {data.recentUsage.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-[#333] tracking-widest">NO_USAGE_DATA</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
