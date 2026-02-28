import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Cookie Policy — AiTrackr',
  description: 'AiTrackr Cookie Policy. We use only strictly necessary cookies — no tracking, no advertising.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-base font-bold font-mono text-white border-l-2 border-amber-500 pl-3">{title}</h2>
      <div className="space-y-3 text-sm text-gray-400 leading-relaxed pl-3">{children}</div>
    </section>
  )
}

export default function CookiesPage() {
  const updated = 'February 25, 2026'

  const cookies = [
    {
      name: 'next-auth.session-token',
      category: 'STRICTLY_NECESSARY',
      purpose: 'Maintains your authenticated session after sign-in. Without this cookie you would be signed out on every page load.',
      party: '1st party (AiTrackr)',
      duration: '30 days',
      persistent: true,
      secure: 'HttpOnly, Secure, SameSite=Lax',
      consentRequired: 'No',
    },
    {
      name: 'next-auth.csrf-token',
      category: 'STRICTLY_NECESSARY',
      purpose: 'Cross-Site Request Forgery (CSRF) protection. Ensures that form submissions and API calls originate from our own pages, not from malicious third-party sites.',
      party: '1st party (AiTrackr)',
      duration: 'Session (deleted when browser closes)',
      persistent: false,
      secure: 'HttpOnly, SameSite=Lax',
      consentRequired: 'No',
    },
    {
      name: 'next-auth.callback-url',
      category: 'STRICTLY_NECESSARY',
      purpose: 'Stores the URL to redirect you back to after a successful sign-in (e.g., /dashboard). Only set during the sign-in flow.',
      party: '1st party (AiTrackr)',
      duration: 'Session',
      persistent: false,
      secure: 'SameSite=Lax',
      consentRequired: 'No',
    },
    {
      name: '__stripe_mid',
      category: 'STRICTLY_NECESSARY',
      purpose: 'Set by Stripe on checkout pages only. Used by Stripe for fraud prevention and to maintain session integrity during payment processing. Not used for tracking.',
      party: '3rd party (Stripe, Inc.)',
      duration: '1 year',
      persistent: true,
      secure: 'SameSite=Strict',
      consentRequired: 'No (strictly necessary for payment processing)',
    },
    {
      name: '__stripe_sid',
      category: 'STRICTLY_NECESSARY',
      purpose: 'Set by Stripe on checkout pages only. Used by Stripe to identify the browsing session for fraud prevention. Not used for advertising or profiling.',
      party: '3rd party (Stripe, Inc.)',
      duration: 'Session',
      persistent: false,
      secure: 'SameSite=Strict',
      consentRequired: 'No (strictly necessary for payment processing)',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white grid-bg">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="AiTrackr" width={140} height={32} className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-amber-500 mb-2">// LEGAL</p>
          <h1 className="text-3xl font-bold font-mono text-white mb-2">COOKIE_POLICY</h1>
          <p className="text-sm font-mono text-gray-500">Last updated: {updated}</p>
          <div className="mt-4 p-4 border border-green-500/20 bg-green-500/5 text-xs font-mono text-green-400 space-y-1">
            <p>✓ This policy complies with the EU ePrivacy Directive 2002/58/EC (as amended by 2009/136/EC)</p>
            <p>✓ This policy complies with GDPR Regulation (EU) 2016/679</p>
          </div>
        </div>

        <div className="space-y-10">

          <Section id="what-are-cookies" title="1. WHAT ARE COOKIES?">
            <p>
              Cookies are small text files that a website places on your device when you visit. They are
              widely used to make websites work efficiently and to provide information to site owners.
              Cookies can be &quot;session cookies&quot; (deleted when you close your browser) or &quot;persistent cookies&quot;
              (stored for a defined period).
            </p>
            <p>
              Cookies can be set by the website you are visiting (&quot;first-party cookies&quot;) or by third-party
              services embedded in that website (&quot;third-party cookies&quot;).
            </p>
          </Section>

          <Section id="our-approach" title="2. OUR APPROACH — NO TRACKING COOKIES">
            <div className="border border-white/10 bg-[#111111] p-5 space-y-3 font-mono text-xs">
              <p className="text-white font-bold">WE DO NOT USE:</p>
              <ul className="space-y-1.5 text-gray-400">
                <li>✕ Google Analytics or any website analytics cookies</li>
                <li>✕ Facebook Pixel or any social media tracking cookies</li>
                <li>✕ Advertising or behavioural profiling cookies</li>
                <li>✕ A/B testing or conversion tracking cookies</li>
                <li>✕ Any cookies that track your activity across other websites</li>
              </ul>
              <p className="text-white font-bold mt-3">WE USE ONLY:</p>
              <ul className="space-y-1.5 text-gray-400">
                <li>✓ Strictly necessary cookies for authentication and security</li>
                <li>✓ Stripe cookies on checkout pages only (fraud prevention)</li>
              </ul>
            </div>
            <p>
              Because we use only strictly necessary cookies, we are <strong className="text-white">not required to display a
              cookie consent banner</strong> under the ePrivacy Directive. However, we are providing this
              policy in full transparency so you understand exactly what is set on your device.
            </p>
          </Section>

          <Section id="cookie-table" title="3. COOKIES WE USE">
            <div className="space-y-4">
              {cookies.map((cookie) => (
                <div key={cookie.name} className="border border-white/10 bg-[#111111] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <code className="text-sm font-mono text-amber-400">{cookie.name}</code>
                    <span className="text-xs font-mono px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20">
                      {cookie.category}
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">PURPOSE: </span>
                      <span className="text-gray-300">{cookie.purpose}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SET BY: </span>
                      <span className="text-gray-300">{cookie.party}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DURATION: </span>
                      <span className="text-gray-300">{cookie.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SECURITY: </span>
                      <span className="text-gray-300">{cookie.secure}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">CONSENT REQUIRED: </span>
                      <span className={cookie.consentRequired === 'No' ? 'text-green-400' : 'text-amber-400'}>
                        {cookie.consentRequired}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="legal-basis" title="4. LEGAL BASIS FOR COOKIES">
            <p>
              Under the ePrivacy Directive and GDPR, cookies that are <strong className="text-white">strictly necessary</strong> for
              a service explicitly requested by the user do not require prior consent. This exemption covers all
              cookies we set, as they are required solely for:
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Providing the authenticated service you have signed up for (session management)</li>
              <li>Protecting the security of your account and our systems (CSRF protection)</li>
              <li>Processing a payment you have initiated (Stripe fraud prevention)</li>
            </ul>
            <p>
              Legal basis under GDPR: <strong className="text-white">Art. 6(1)(b) — Contract performance</strong> and
              <strong className="text-white"> Art. 6(1)(f) — Legitimate interests</strong> (security and fraud prevention).
            </p>
          </Section>

          <Section id="third-party" title="5. THIRD-PARTY COOKIES (STRIPE)">
            <p>
              Stripe cookies (<code className="text-gray-300">__stripe_mid</code> and <code className="text-gray-300">__stripe_sid</code>) are
              set only when you navigate to a checkout page to purchase a Pro subscription. They are
              not set on any other page of AiTrackr.
            </p>
            <p>
              These cookies are subject to Stripe&apos;s own privacy policy:{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">
                stripe.com/privacy
              </a>
            </p>
            <p>
              Stripe is certified under the EU–US Data Privacy Framework. Data processed by these cookies
              is used exclusively for fraud detection and payment integrity — not for advertising.
            </p>
          </Section>

          <Section id="manage-cookies" title="6. HOW TO MANAGE &amp; DELETE COOKIES">
            <p>
              You can control and delete cookies through your browser settings. Below are links to
              cookie management instructions for the most common browsers:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              {[
                ['Chrome', 'https://support.google.com/chrome/answer/95647'],
                ['Firefox', 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer'],
                ['Safari', 'https://support.apple.com/en-gb/guide/safari/sfri11471/mac'],
                ['Edge', 'https://support.microsoft.com/en-us/windows/delete-and-manage-cookies'],
                ['Opera', 'https://help.opera.com/en/latest/web-preferences/#cookies'],
                ['Brave', 'https://support.brave.com/hc/en-us/articles/360022806212'],
              ].map(([browser, url]) => (
                <a key={browser} href={url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-center">
                  {browser} →
                </a>
              ))}
            </div>
            <div className="border border-amber-500/20 bg-amber-500/5 p-4 text-xs font-mono text-amber-400">
              ⚠ Deleting the <code>next-auth.session-token</code> cookie will sign you out of AiTrackr.
              All other functionality will continue to work normally.
            </div>
          </Section>

          <Section id="do-not-track" title="7. DO NOT TRACK">
            <p>
              Some browsers transmit a &quot;Do Not Track&quot; (DNT) signal. Since we do not engage in
              cross-site tracking, behavioural advertising, or analytics, there is no meaningful change
              in our behaviour in response to a DNT signal. We do not track you regardless.
            </p>
          </Section>

          <Section id="changes" title="8. CHANGES TO THIS POLICY">
            <p>
              We will update this Cookie Policy if we add new cookies or our use of cookies changes materially.
              Changes will be reflected in the &quot;Last updated&quot; date at the top. We will notify users of
              material changes via email.
            </p>
          </Section>

          <Section id="contact" title="9. CONTACT">
            <p>
              For questions about cookies or this policy, contact:{' '}
              <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a>
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-xs font-mono text-gray-600">
          <Link href="/" className="hover:text-white transition-colors">← HOME</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY_POLICY</Link>
          <Link href="/terms" className="hover:text-white transition-colors">TERMS_OF_SERVICE</Link>
        </div>
      </main>
    </div>
  )
}
