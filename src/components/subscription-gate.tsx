'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface SubscriptionGateProps {
  children: React.ReactNode
  feature?: string
  showUpgradeInline?: boolean
}

export function SubscriptionGate({ children, feature, showUpgradeInline }: SubscriptionGateProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isPro = session?.user?.subscriptionStatus === 'PRO'

  if (isPro) return <>{children}</>

  if (showUpgradeInline) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg text-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground text-sm">
          {feature ? `${feature} is a Pro feature.` : 'Upgrade to Pro to unlock this feature.'}
        </p>
        <Button onClick={() => router.push('/pricing')} size="sm">
          Upgrade to Pro — €8/month
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
        <div className="pointer-events-none opacity-50">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="sm" variant="secondary">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade to unlock
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pro Feature</DialogTitle>
            <DialogDescription>
              {feature
                ? `${feature} is available on the Pro plan.`
                : 'This feature requires a Pro subscription.'}
              {' '}Upgrade for €8/month.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); router.push('/pricing') }}>
              <Sparkles className="h-4 w-4 mr-2" />
              See Pro Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
