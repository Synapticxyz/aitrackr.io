'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
    if (!session) { router.push('/auth/signin?callbackUrl=/pricing'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId }) })
      if (res.ok) { const { url } = await res.json() as { url: string }; window.location.href = url }
      else toast.error('Failed to start checkout. Please try again.')
    } finally { setLoading(false) }
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 border border-white/20 text-sm font-mono text-gray-300 hover:border-white/40 hover:text-white transition-all disabled:opacity-60"
      >
        {loading ? 'REDIRECTING...' : label}
      </button>
    )
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60"
    >
      {loading ? 'REDIRECTING...' : label}
    </button>
  )
}
