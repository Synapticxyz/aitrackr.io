import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Activity } from 'lucide-react'
import { CheckoutButton } from './_checkout-button'

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description: 'AiTrackr pricing. Free forever plan + Pro at $8/month or $79/year.',
}

const FREE_FEATURES = [
  'Up to 3 subscriptions',
  'Manual subscription entry',
  'Renewal email alerts',
  'Basic usage analytics',
  'Data export (GDPR)',
  'Account deletion (GDPR)',
]

const PRO_FEATURES = [
  'Unlimited subscriptions',
  'Chrome extension (auto-tracking)',
  'Overlap Engine detection',
  'Advanced analytics & charts',
  'Cost-per-hour efficiency metrics',
  'Priority email support',
  'All Free features included',
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white grid-bg">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white flex items-center justify-center">
            <Activity className="h-4 w-4 text-black" />
          </div>
          <span className="font-mono font-bold text-white">AiTrackr</span>
        </Link>
        <Link href="/auth/signin" className="text-xs font-mono text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-2 hover:border-white/20">
          SIGN_IN
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-amber-500 mb-3">// PRICING</p>
          <h1 className="text-4xl font-bold font-mono text-white mb-4">SIMPLE_PRICING</h1>
          <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto">
            Start free. Upgrade when you need the Chrome extension and unlimited tracking.
          </p>
        </div>

        <div className="grid gap-px md:grid-cols-2 bg-white/10 border border-white/10">
          {/* Free */}
          <div className="bg-[#0A0A0A] p-8">
            <p className="text-xs font-mono text-gray-500 mb-1">PLAN_FREE</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold font-mono text-white">$0</span>
              <span className="text-gray-500 font-mono text-sm mb-1">/forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-mono text-gray-300">
                  <Check className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="block w-full py-3 text-center border border-white/20 text-sm font-mono text-gray-300 hover:border-white/40 hover:text-white transition-all">
              GET_STARTED_FREE
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-[#111111] p-8 relative">
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 bg-amber-500 text-black text-xs font-mono font-bold">MOST_POPULAR</span>
            </div>
            <p className="text-xs font-mono text-amber-500 mb-1">PLAN_PRO</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold font-mono text-white">$8</span>
              <span className="text-gray-500 font-mono text-sm mb-1">/month</span>
            </div>
            <p className="text-xs font-mono text-gray-500 mb-6">or $79/year — save 18%</p>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-mono text-gray-300">
                  <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <CheckoutButton priceId={process.env.STRIPE_PRICE_ID_MONTHLY ?? ''} label="SUBSCRIBE_MONTHLY — $8/mo" />
              <CheckoutButton priceId={process.env.STRIPE_PRICE_ID_YEARLY ?? ''} label="SUBSCRIBE_YEARLY — $79/yr" variant="outline" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-mono text-gray-600">
          30-day money-back guarantee. Cancel anytime.{' '}
          <Link href="/privacy" className="text-gray-500 hover:text-white underline">Privacy Policy</Link>
        </p>
      </section>
    </div>
  )
}
