import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'AiTrackr Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 24, 2026</p>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance</h2>
          <p>By using AiTrackr, you agree to these Terms. If you disagree, do not use the service.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Service Description</h2>
          <p>AiTrackr provides subscription tracking and usage analytics for AI tools. We are not affiliated with any AI provider (OpenAI, Anthropic, Google, etc.).</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Accounts</h2>
          <p>You must provide accurate information. You are responsible for maintaining account security. One account per person.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Free & Pro Plans</h2>
          <p>The Free plan is limited to 3 subscriptions. Pro plan provides unlimited subscriptions and Chrome extension access for $8/month or $79/year. Prices may change with 30 days notice.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Acceptable Use</h2>
          <p>Do not: reverse engineer the service, scrape data, create fake accounts, use the service for illegal purposes, or attempt to bypass rate limits.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Termination</h2>
          <p>We may suspend or terminate accounts for violations. You may delete your account at any time from Settings.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>AiTrackr is provided "as is". We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the 12 months preceding the claim.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
          <p><a href="mailto:hello@aitrackr.io" className="text-primary underline">hello@aitrackr.io</a></p>
        </section>
      </div>
    </div>
  )
}
