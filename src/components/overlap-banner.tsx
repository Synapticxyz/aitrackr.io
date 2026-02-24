'use client'

import { useState } from 'react'
import { AlertTriangle, X, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  DUPLICATE_CAPABILITY: {
    icon: AlertTriangle,
    label: 'Duplicate Capability',
    color: 'border-yellow-500/50 bg-yellow-500/10',
    iconColor: 'text-yellow-500',
  },
  UNUSED_SUBSCRIPTION: {
    icon: TrendingDown,
    label: 'Unused Subscription',
    color: 'border-red-500/50 bg-red-500/10',
    iconColor: 'text-red-500',
  },
  WRONG_TIER: {
    icon: AlertTriangle,
    label: 'Wrong Tier',
    color: 'border-blue-500/50 bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
}

export function OverlapBanner({ id, type, description, potentialSavings, currency = 'USD' }: OverlapBannerProps) {
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
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.color}`}>
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{config.label}</p>
        <p className="text-sm">{description}</p>
        {potentialSavings > 0 && (
          <p className="text-sm font-medium text-green-500 mt-1">
            Potential savings: {formatMoney(potentialSavings, currency)}/month
          </p>
        )}
      </div>
      <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={handleDismiss}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
