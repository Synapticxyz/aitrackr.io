import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap } from 'lucide-react'
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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          AiTrackr
        </Link>
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm">Sign In</Button>
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg mb-12">Start free. Upgrade when you need the Chrome extension and unlimited tracking.</p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-8 text-left">
              <p className="text-xl font-bold mb-1">Free</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground mb-1">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">Get Started Free</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Most Popular</Badge>
            </div>
            <CardContent className="pt-8 text-left">
              <p className="text-xl font-bold mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold">$8</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">or $79/year (save 18%)</p>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <CheckoutButton
                  priceId={process.env.STRIPE_PRICE_ID_MONTHLY ?? ''}
                  label="Subscribe Monthly — $8/mo"
                />
                <CheckoutButton
                  priceId={process.env.STRIPE_PRICE_ID_YEARLY ?? ''}
                  label="Subscribe Yearly — $79/yr"
                  variant="outline"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          All plans include 30-day money-back guarantee. Cancel anytime.{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </section>
    </div>
  )
}
