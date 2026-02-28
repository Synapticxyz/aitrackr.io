'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingDown, X } from 'lucide-react'
import { formatMoney } from '@/lib/currencies'
import { toast } from 'sonner'

interface OverlapBannerProps {
  id: string
  type: 'DUPLICATE_CAPABILITY' | 'UNUSED_SUBSCRIPTION' | 'WRONG_TIER'
  description: string
  potentialSavings: number
  currency?: string
}

const typeConfig = {
  DUPLICATE_CAPABILITY: { icon: AlertTriangle, label: 'DUPLICATE_CAPABILITY', border: 'border-amber-500/40', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' },
  UNUSED_SUBSCRIPTION: { icon: TrendingDown, label: 'UNUSED_SUBSCRIPTION', border: 'border-red-500/40', bg: 'bg-red-500/5', iconColor: 'text-red-400' },
  WRONG_TIER: { icon: AlertTriangle, label: 'WRONG_TIER', border: 'border-blue-500/40', bg: 'bg-blue-500/5', iconColor: 'text-blue-400' },
}

export function OverlapBanner({ id, type, description, potentialSavings, currency = 'EUR' }: OverlapBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  if (dismissed) return null

  async function handleDismiss() {
    try {
      const res = await fetch('/api/analyze/overlaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: id }),
      })
      if (res.ok) {
        setDismissed(true)
        toast.success('Alert dismissed')
      }
    } catch {
      toast.error('Failed to dismiss alert')
    }
  }

  return (
    <div className={`flex items-start gap-3 p-4 border ${config.border} ${config.bg}`}>
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-mono font-bold mb-1 ${config.iconColor}`}>[{config.label}]</p>
        <p className="text-sm text-gray-300">{description}</p>
        {potentialSavings > 0 && (
          <p className="text-xs font-mono text-amber-500 mt-1.5">
            POTENTIAL_SAVINGS: {formatMoney(potentialSavings, currency)}/month
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="text-gray-600 hover:text-white transition-colors flex-shrink-0 p-1"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
