'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CheckoutButtonProps {
  priceId: string
  label: string
  variant?: 'default' | 'outline'
}

export function CheckoutButton({ priceId, label, variant = 'default' }: CheckoutButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      if (res.ok) {
        const { url } = await res.json() as { url: string }
        window.location.href = url
      } else {
        toast.error('Failed to start checkout. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} className="w-full" onClick={handleCheckout} disabled={loading}>
      {loading ? 'Redirecting...' : label}
    </Button>
  )
}
