'use client'

import { useEffect, useState } from 'react'
import { formatDuration } from '@/lib/utils'

interface RealtimeData {
  totalSeconds: number
  totalMinutes: number
  byTool: Record<string, number>
  topTool: string | null
  sessionCount: number
  updatedAt: string
}

export function RealtimeTracker() {
  const [data, setData] = useState<RealtimeData | null>(null)
  const [error, setError] = useState(false)

  async function fetchData() {
    try {
      const res = await fetch('/api/usage/realtime')
      if (res.ok) { setData(await res.json() as RealtimeData); setError(false) }
    } catch { setError(true) }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error) return <p className="text-xs font-mono text-gray-500">ERR: Unable to fetch live data</p>
  if (!data) return <p className="text-xs font-mono text-gray-600 animate-pulse">LOADING...</p>

  if (data.totalSeconds === 0) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-mono text-gray-500">NO_ACTIVITY_TODAY</p>
        <p className="text-xs font-mono text-gray-600">Make sure the Chrome extension is installed and connected.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-3xl font-bold font-mono text-amber-500">{formatDuration(data.totalSeconds)}</p>
        <p className="text-xs font-mono text-gray-500 mt-1">total today · {data.sessionCount} sessions</p>
      </div>
      <div className="space-y-1">
        {Object.entries(data.byTool).sort((a, b) => b[1] - a[1]).map(([tool, seconds]) => (
          <div key={tool} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
            <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">{tool}</span>
            <span className="text-xs font-mono text-gray-400">{formatDuration(seconds)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
