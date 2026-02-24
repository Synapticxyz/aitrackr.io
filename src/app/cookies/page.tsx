import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'AiTrackr Cookie Policy — what cookies we use and why.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 24, 2026</p>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Cookies We Use</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="font-medium text-foreground">next-auth.session-token</p>
              <p className="text-xs mt-1">Purpose: Authentication session management</p>
              <p className="text-xs">Duration: 30 days</p>
              <p className="text-xs">Type: HttpOnly, Secure, SameSite=Lax</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-medium text-foreground">next-auth.csrf-token</p>
              <p className="text-xs mt-1">Purpose: CSRF attack prevention</p>
              <p className="text-xs">Duration: Session</p>
              <p className="text-xs">Type: HttpOnly, SameSite=Lax</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-medium text-foreground">__stripe_mid / __stripe_sid</p>
              <p className="text-xs mt-1">Purpose: Stripe fraud prevention (only on checkout pages)</p>
              <p className="text-xs">Duration: 1 year / Session</p>
              <p className="text-xs">Type: Stripe third-party cookie</p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">No Tracking or Analytics Cookies</h2>
          <p>We do not use Google Analytics, Facebook Pixel, or any behavioral tracking cookies. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Managing Cookies</h2>
          <p>You can delete cookies through your browser settings. Note: deleting the session cookie will sign you out.</p>
        </section>
      </div>
    </div>
  )
}
