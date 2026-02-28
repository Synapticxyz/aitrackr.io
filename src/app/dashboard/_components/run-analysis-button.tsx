'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scan } from 'lucide-react'
import { toast } from 'sonner'

export function RunAnalysisButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function run() {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze/overlaps')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json() as { alerts: unknown[] }
      const count = data.alerts?.length ?? 0
      toast.success(count > 0 ? `Found ${count} overlap${count !== 1 ? 's' : ''}` : 'No overlaps detected')
      router.refresh()
    } catch {
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={run}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
    >
      <Scan className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'ANALYZING...' : 'RUN_ANALYSIS'}
    </button>
  )
}
