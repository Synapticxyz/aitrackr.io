'use client'

import { useEffect, useState } from 'react'
import { formatDuration } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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
      if (res.ok) {
        const json = await res.json() as RealtimeData
        setData(json)
        setError(false)
      }
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <p className="text-sm text-muted-foreground">Unable to fetch live data</p>
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
  }

  if (data.totalSeconds === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">No activity today</p>
        <p className="text-xs text-muted-foreground">
          Make sure the Chrome extension is installed and connected.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-3xl font-bold">{formatDuration(data.totalSeconds)}</p>
        <p className="text-xs text-muted-foreground">total today across {data.sessionCount} sessions</p>
      </div>
      <div className="space-y-1.5">
        {Object.entries(data.byTool)
          .sort((a, b) => b[1] - a[1])
          .map(([tool, seconds]) => (
            <div key={tool} className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">{tool}</Badge>
              <span className="text-sm text-muted-foreground">{formatDuration(seconds)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
