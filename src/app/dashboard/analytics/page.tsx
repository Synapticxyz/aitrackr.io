'use client'

import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatDuration } from '@/lib/utils'
import { Download, RefreshCw } from 'lucide-react'

const COLORS = ['#F59E0B', '#FCD34D', '#D97706', '#B45309', '#92400E', '#78350F', '#6366f1', '#8b5cf6']

type Period = '7' | '30' | '90'
interface UsageEntry { tool: string; seconds: number }
interface GroupedData { grouped: Record<string, number> }

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30')
  const [usageByTool, setUsageByTool] = useState<UsageEntry[]>([])
  const [usageByDate, setUsageByDate] = useState<{ date: string; minutes: number }[]>([])
  const [loading, setLoading] = useState(true)

  async function load(days: Period) {
    setLoading(true)
    try {
      const [toolRes, dateRes] = await Promise.all([
        fetch(`/api/usage?days=${days}&groupBy=tool`, { cache: 'no-store' }),
        fetch(`/api/usage?days=${days}&groupBy=date`, { cache: 'no-store' }),
      ])
      if (toolRes.ok) {
        const data = await toolRes.json() as GroupedData
        setUsageByTool(Object.entries(data.grouped).map(([tool, seconds]) => ({ tool, seconds })).sort((a, b) => b.seconds - a.seconds))
      }
      if (dateRes.ok) {
        const data = await dateRes.json() as GroupedData
        setUsageByDate(Object.entries(data.grouped).map(([date, seconds]) => ({ date: date.slice(5), minutes: Math.round(seconds / 60) })).sort((a, b) => a.date.localeCompare(b.date)))
      }
    } finally { setLoading(false) }
  }

  useEffect(() => { load(period) }, [period])

  function exportCsv() {
    const totalSeconds = usageByTool.reduce((s, u) => s + u.seconds, 0)
    const fmtTime = (s: number) => {
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    }

    const lines: string[] = []
    lines.push('AiTrackr Usage Report')
    lines.push(`Period,Last ${period} days`)
    lines.push(`Exported,${new Date().toLocaleDateString('en-GB')}`)
    lines.push('')
    lines.push('Tool,Hours,Minutes,Seconds,Share')
    for (const u of usageByTool) {
      const h = Math.floor(u.seconds / 3600)
      const m = Math.floor((u.seconds % 3600) / 60)
      const pct = totalSeconds > 0 ? ((u.seconds / totalSeconds) * 100).toFixed(1) + '%' : '0%'
      lines.push(`${u.tool},${h},${m},${u.seconds},${pct}`)
    }
    lines.push('')
    lines.push(`Total,${Math.floor(totalSeconds / 3600)},${Math.floor((totalSeconds % 3600) / 60)},${totalSeconds},100%`)

    if (usageByDate.length > 0) {
      lines.push('')
      lines.push('Daily Breakdown')
      lines.push('Date,Minutes,Duration')
      for (const d of usageByDate) {
        lines.push(`${d.date},${d.minutes},${fmtTime(d.minutes * 60)}`)
      }
    }

    const csv = lines.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `aitrackr-usage-${period}days.csv`; a.click()
  }

  const totalMinutes = usageByTool.reduce((sum, u) => sum + Math.round(u.seconds / 60), 0)
  const PERIODS: Period[] = ['7', '30', '90']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500">// INSIGHTS</p>
          <h1 className="text-2xl font-bold font-mono text-white mt-1">ANALYTICS</h1>
          <p className="text-sm font-mono text-gray-400">Usage patterns and cost efficiency</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load(period)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            EXPORT_CSV
          </button>
        </div>
      </div>
      {usageByTool.length === 0 && !loading && (
        <p className="text-xs font-mono text-amber-500/80">
          No data yet? Use the extension on an AI tool, then switch tabs and click <strong>Sync now</strong> in the extension. Use the same account here as the extension API key.
        </p>
      )}

      {/* Period selector */}
      <div className="flex gap-0 border border-white/10 w-fit">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-xs font-mono transition-colors border-r border-white/10 last:border-0 ${period === p ? 'bg-amber-500 text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            {p}_DAYS
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* By tool */}
        <div className="border border-white/10 bg-[#111111]">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-mono font-bold text-white">USAGE_BY_TOOL</p>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-64 animate-pulse bg-white/5" />
            ) : usageByTool.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 text-center py-8">NO_USAGE_DATA_YET</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={usageByTool} dataKey="seconds" nameKey="tool" cx="50%" cy="50%" outerRadius={90}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ tool, percent }: any) => `${tool} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {usageByTool.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v: number | undefined) => [formatDuration(v ?? 0), 'Duration']}
                    contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: 11, color: '#fff' }}
                    itemStyle={{ color: '#d4d4d4' }}
                    labelStyle={{ color: '#f5f5f5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Daily bar */}
        <div className="border border-white/10 bg-[#111111]">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-mono font-bold text-white">DAILY_USAGE_MINUTES</p>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-64 animate-pulse bg-white/5" />
            ) : usageByDate.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 text-center py-8">NO_USAGE_DATA_YET</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={usageByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: 11, color: '#fff' }} itemStyle={{ color: '#d4d4d4' }} labelStyle={{ color: '#f5f5f5' }} />
                  <Bar dataKey="minutes" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="border border-white/10 bg-[#111111]">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs font-mono font-bold text-white">USAGE_SUMMARY</p>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="h-32 animate-pulse bg-white/5" />
          ) : usageByTool.length === 0 ? (
            <p className="text-xs font-mono text-gray-500">NO_DATA_FOR_PERIOD</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-xs font-mono text-gray-500">TOOL</th>
                  <th className="text-right py-2 text-xs font-mono text-gray-500">DURATION</th>
                  <th className="text-right py-2 text-xs font-mono text-gray-500">SHARE</th>
                </tr>
              </thead>
              <tbody>
                {usageByTool.map((u) => (
                  <tr key={u.tool} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 text-xs font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">{u.tool}</span>
                    </td>
                    <td className="py-2.5 text-right text-xs font-mono text-white">{formatDuration(u.seconds)}</td>
                    <td className="py-2.5 text-right text-xs font-mono text-gray-500">
                      {totalMinutes > 0 ? ((u.seconds / 60 / totalMinutes) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
