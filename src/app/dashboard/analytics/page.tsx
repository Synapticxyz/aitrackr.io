'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { Download } from 'lucide-react'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#64748b']

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
        fetch(`/api/usage?days=${days}&groupBy=tool`),
        fetch(`/api/usage?days=${days}&groupBy=date`),
      ])
      if (toolRes.ok) {
        const data = await toolRes.json() as GroupedData
        setUsageByTool(
          Object.entries(data.grouped).map(([tool, seconds]) => ({ tool, seconds }))
            .sort((a, b) => b.seconds - a.seconds)
        )
      }
      if (dateRes.ok) {
        const data = await dateRes.json() as GroupedData
        setUsageByDate(
          Object.entries(data.grouped).map(([date, seconds]) => ({
            date: date.slice(5),
            minutes: Math.round(seconds / 60),
          })).sort((a, b) => a.date.localeCompare(b.date))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(period) }, [period])

  function exportCsv() {
    const rows = usageByTool.map((u) => `${u.tool},${u.seconds},${Math.round(u.seconds / 60)}`)
    const csv = ['Tool,Seconds,Minutes', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aitrackr-usage-${period}days.csv`
    a.click()
  }

  const totalMinutes = usageByTool.reduce((sum, u) => sum + Math.round(u.seconds / 60), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Usage patterns and cost efficiency</p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="7">7 days</TabsTrigger>
          <TabsTrigger value="30">30 days</TabsTrigger>
          <TabsTrigger value="90">90 days</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usage by Tool</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 animate-pulse bg-muted rounded" />
            ) : usageByTool.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No usage data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={usageByTool}
                    dataKey="seconds"
                    nameKey="tool"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ tool, percent }: any) => `${tool} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {usageByTool.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number | undefined) => [formatDuration(v ?? 0), 'Duration']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Usage (minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 animate-pulse bg-muted rounded" />
            ) : usageByDate.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No usage data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={usageByDate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-32 animate-pulse bg-muted rounded" />
          ) : usageByTool.length === 0 ? (
            <p className="text-muted-foreground text-sm">No data for this period</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2">Tool</th>
                  <th className="text-right py-2">Duration</th>
                  <th className="text-right py-2">Share</th>
                </tr>
              </thead>
              <tbody>
                {usageByTool.map((u) => (
                  <tr key={u.tool} className="border-b border-border/50">
                    <td className="py-2 font-medium">{u.tool}</td>
                    <td className="py-2 text-right">{formatDuration(u.seconds)}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {totalMinutes > 0 ? ((u.seconds / 60 / totalMinutes) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
