import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'AiTrackr Privacy Policy — GDPR compliant. We only collect usage metadata, never your prompts.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 24, 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. What We Collect</h2>
          <p className="text-muted-foreground"><strong>Account data:</strong> Name, email address, profile image (from Google OAuth).</p>
          <p className="text-muted-foreground mt-2"><strong>Subscription data:</strong> Names, costs, and billing dates of AI subscriptions you manually enter.</p>
          <p className="text-muted-foreground mt-2"><strong>Usage metadata (Chrome extension only):</strong></p>
          <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
            <li>Which AI tool was active (e.g., ChatGPT, Claude)</li>
            <li>How long you used it (duration in seconds)</li>
            <li>Which model/feature was selected (e.g., GPT-4, image generation)</li>
            <li>A random session ID (not linked to any conversation)</li>
          </ul>
        </section>

        <section className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">What We NEVER Collect</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Your prompts or conversations</strong></li>
            <li>Any text you type into AI tools</li>
            <li>AI responses or generated content</li>
            <li>Any browsing history outside of supported AI tool domains</li>
            <li>Passwords (we store only bcrypt hashes)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Legal Basis for Processing (GDPR)</h2>
          <p className="text-muted-foreground">We process your data under:</p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li><strong>Contract performance</strong> (Art. 6(1)(b)) — to provide the service</li>
            <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — to improve service quality and prevent fraud</li>
            <li><strong>Consent</strong> (Art. 6(1)(a)) — for marketing emails (opt-in only)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Data Retention</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Usage logs: Retained for the lifetime of your account</li>
            <li>Subscription data: Retained until deleted or account closure</li>
            <li>Account data: Retained until account deletion request</li>
            <li>After deletion request: Soft-deleted immediately, hard-deleted within 30 days</li>
            <li>Audit logs: 90 days for security purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Your Rights (GDPR)</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Access (Art. 15):</strong> Request a copy of your data anytime from Settings</li>
            <li><strong>Portability (Art. 20):</strong> Export your data as JSON from Settings → Data & Privacy</li>
            <li><strong>Erasure (Art. 17):</strong> Delete your account from Settings → Data & Privacy</li>
            <li><strong>Rectification (Art. 16):</strong> Update your profile information in Settings</li>
            <li><strong>Object (Art. 21):</strong> Opt out of marketing emails in Settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Stripe:</strong> Payment processing. Stripe stores payment card data; we never see it.</li>
            <li><strong>Google OAuth:</strong> Optional sign-in. We receive only your name, email, and profile picture.</li>
            <li><strong>Resend:</strong> Email delivery. We share your email address to send transactional emails.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Security</h2>
          <p className="text-muted-foreground">Data is encrypted in transit (TLS 1.3) and at rest (PostgreSQL on encrypted Hetzner VPS). Passwords are hashed with bcrypt (cost factor 12). API keys are unique per user and rate-limited.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
          <p className="text-muted-foreground">For privacy requests: <a href="mailto:privacy@aitrackr.io" className="text-primary underline">privacy@aitrackr.io</a></p>
          <p className="text-muted-foreground mt-1">EU representative: Available on request.</p>
        </section>
      </div>
    </div>
  )
}
