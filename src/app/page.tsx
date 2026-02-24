import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, BarChart3, Shield, DollarSign, Puzzle, Clock, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          AiTrackr
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <Badge variant="secondary" className="mb-6">Privacy-First Chrome Extension</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          Stop Overpaying for{' '}
          <span className="text-primary">AI Tools</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AiTrackr automatically tracks your time on ChatGPT, Claude, Midjourney and more.
          Discover overlapping subscriptions and cut your AI bill.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Start Tracking Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">See Pricing</Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Free plan forever · GDPR compliant
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to optimize your AI spending</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: 'Automatic Time Tracking',
              desc: 'Our Chrome extension silently tracks time spent on AI tools. Zero manual input. Never reads your prompts.',
            },
            {
              icon: Puzzle,
              title: 'Overlap Engine',
              desc: 'Detects when you pay for the same capability twice. E.g. image generation in both ChatGPT Plus and Midjourney.',
            },
            {
              icon: DollarSign,
              title: 'Cost Efficiency Metrics',
              desc: 'See your "cost per hour" for each tool. Instantly spot subscriptions that cost too much for how little you use them.',
            },
            {
              icon: BarChart3,
              title: 'Usage Analytics',
              desc: 'Beautiful charts showing usage trends, tool distribution, and monthly spend over time.',
            },
            {
              icon: Shield,
              title: 'Privacy First',
              desc: 'We only collect metadata: tool name, time spent, model version. Zero content, zero prompts. Always.',
            },
            {
              icon: Zap,
              title: 'Renewal Alerts',
              desc: 'Email reminders 3 days before any subscription renews. Never get surprised by a charge again.',
            },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-6">
                <f.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-muted-foreground mb-10">Start free, upgrade when you need more</p>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6 text-left">
              <p className="font-semibold text-lg mb-1">Free</p>
              <p className="text-3xl font-bold mb-4">$0</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['3 subscriptions', 'Manual entry', 'Renewal alerts', 'Basic analytics'].map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{f}</li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block mt-6">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardContent className="pt-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-lg">Pro</p>
                <Badge className="text-xs">Most Popular</Badge>
              </div>
              <p className="text-3xl font-bold mb-4">$8<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Unlimited subscriptions', 'Chrome extension', 'Overlap Engine', 'Advanced analytics', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Link href="/pricing" className="block mt-6">
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 AiTrackr. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
