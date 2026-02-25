import type { Metadata } from 'next'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — AiTrackr',
  description: 'AiTrackr Privacy Policy — GDPR compliant. We only collect usage metadata, never your prompts or content.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-base font-bold font-mono text-white border-l-2 border-amber-500 pl-3">{title}</h2>
      <div className="space-y-3 text-sm text-gray-400 leading-relaxed pl-3">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-mono font-bold text-gray-300">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, string> = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return <span className={`inline-block px-2 py-0.5 text-xs font-mono border ${map[color]}`}>{children}</span>
}

export default function PrivacyPage() {
  const updated = 'February 25, 2026'

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white grid-bg">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white flex items-center justify-center">
            <Activity className="h-4 w-4 text-black" />
          </div>
          <span className="font-mono font-bold text-white">AiTrackr</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-amber-500 mb-2">// LEGAL</p>
          <h1 className="text-3xl font-bold font-mono text-white mb-2">PRIVACY_POLICY</h1>
          <p className="text-sm font-mono text-gray-500">Last updated: {updated} · Effective immediately</p>
          <div className="mt-4 p-4 border border-green-500/20 bg-green-500/5 text-xs font-mono text-green-400">
            ✓ This policy is written to comply with the EU General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679
          </div>
        </div>

        {/* Important notice box */}
        <div className="mb-10 p-5 border border-amber-500/20 bg-amber-500/5 space-y-2">
          <p className="text-xs font-mono font-bold text-amber-500">WHAT_WE_NEVER_COLLECT</p>
          <ul className="space-y-1 text-sm text-gray-400 font-mono">
            <li>✕ Your prompts, chats, or AI conversations</li>
            <li>✕ Any text you type into AI tools</li>
            <li>✕ AI-generated responses or content</li>
            <li>✕ Browsing history outside of supported AI tool domains</li>
            <li>✕ Payment card data (handled exclusively by Stripe)</li>
          </ul>
        </div>

        <div className="space-y-10">
          {/* 1 */}
          <Section id="controller" title="1. DATA CONTROLLER">
            <p>
              The data controller responsible for processing your personal data is:
            </p>
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-1">
              <p className="text-white font-bold">AiTrackr</p>
              <p>Operating as a sole trader / startup</p>
              {/* FILL IN before launch */}
              <p className="text-amber-400">[ REGISTERED COMPANY NAME & ADDRESS — fill in before launch ]</p>
              <p>Email: <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a></p>
            </div>
            <p>
              We do not currently have a mandatory Data Protection Officer (DPO). For all privacy-related
              enquiries, contact us at <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a>.
            </p>
          </Section>

          {/* 2 */}
          <Section id="data-collected" title="2. PERSONAL DATA WE COLLECT">
            <SubSection title="2.1 Account Data">
              <p>When you register or sign in:</p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                <li>Full name and email address</li>
                <li>Profile picture URL (Google OAuth only — fetched from Google&apos;s CDN, not stored by us)</li>
                <li>Password (bcrypt-hashed, cost factor 12 — we never store plaintext passwords)</li>
                <li>Account creation timestamp and last login</li>
              </ul>
            </SubSection>
            <SubSection title="2.2 Subscription Data">
              <p>Information you manually enter about your AI subscriptions:</p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                <li>Subscription name, provider, monthly cost, billing cycle</li>
                <li>Next billing date, category, features list, URL, notes</li>
              </ul>
            </SubSection>
            <SubSection title="2.3 Usage Metadata (Chrome Extension — Pro plan only)">
              <p>If you install the Chrome extension, we collect only:</p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                <li>Domain of the AI tool visited (e.g., <code className="text-gray-300">chat.openai.com</code>)</li>
                <li>Duration of the session in seconds</li>
                <li>Model or feature selected (inferred from page structure, e.g., &quot;GPT-4o&quot;)</li>
                <li>A randomly-generated session ID (no link to any conversation content)</li>
                <li>Session timestamp</li>
              </ul>
              <p className="text-amber-400 font-mono text-xs">
                The extension does NOT read, store, transmit, or infer any text, prompts, responses, or page content.
              </p>
            </SubSection>
            <SubSection title="2.4 Payment Data">
              <p>
                All payment processing is handled by <strong className="text-white">Stripe, Inc.</strong> We never see or store
                card numbers, CVVs, or bank details. We receive from Stripe only: your Stripe customer ID,
                subscription status (FREE/PRO), current plan price ID, and subscription period end date.
              </p>
            </SubSection>
            <SubSection title="2.5 Technical / Log Data">
              <p>Standard server logs include:</p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                <li>IP address (used for rate limiting, retained max 7 days in logs)</li>
                <li>HTTP request method, path, status code, timestamp</li>
                <li>Browser user-agent string</li>
              </ul>
              <p>We do not use cookies for analytics or advertising. See our <Link href="/cookies" className="text-amber-500 underline">Cookie Policy</Link>.</p>
            </SubSection>
          </Section>

          {/* 3 */}
          <Section id="legal-basis" title="3. LEGAL BASIS FOR PROCESSING (GDPR ART. 6)">
            <div className="space-y-3">
              {[
                { basis: 'Art. 6(1)(b) — Contract performance', tag: 'CONTRACT', color: 'blue', desc: 'Processing your account data, subscription data, and usage logs to deliver the service you subscribed to.' },
                { basis: 'Art. 6(1)(c) — Legal obligation', tag: 'LEGAL OBLIGATION', color: 'blue', desc: 'Retaining transaction records for tax and accounting obligations (typically 7–10 years depending on jurisdiction).' },
                { basis: 'Art. 6(1)(f) — Legitimate interests', tag: 'LEGIT INTERESTS', color: 'amber', desc: 'Processing server logs for security, fraud prevention, rate limiting, and service reliability. Our legitimate interest is outweighed only where your fundamental rights take precedence — you may object at any time.' },
                { basis: 'Art. 6(1)(a) — Consent', tag: 'CONSENT', color: 'green', desc: 'Sending marketing emails (product updates, tips). You can withdraw consent at any time via Settings → Email Preferences or by clicking "Unsubscribe" in any email.' },
              ].map((item) => (
                <div key={item.basis} className="border border-white/10 bg-[#111111] p-4 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag color={item.color}>{item.tag}</Tag>
                    <span className="text-xs font-mono text-gray-500">{item.basis}</span>
                  </div>
                  <p className="text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 4 */}
          <Section id="retention" title="4. DATA RETENTION">
            <div className="border border-white/10 overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-4 py-2 text-gray-400">DATA TYPE</th>
                    <th className="text-left px-4 py-2 text-gray-400">RETENTION PERIOD</th>
                    <th className="text-left px-4 py-2 text-gray-400">BASIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Account & profile', 'Until deletion request + 30 days grace', 'Contract'],
                    ['Subscription records', 'Until deletion or account closure', 'Contract'],
                    ['Usage logs (extension)', 'Lifetime of account; deleted with account', 'Contract'],
                    ['Audit logs (GDPR actions)', '90 days', 'Legal obligation'],
                    ['Server / IP logs', 'Max 7 days rolling', 'Legitimate interest'],
                    ['Billing records (Stripe)', '7 years (tax compliance)', 'Legal obligation'],
                    ['Marketing consent records', 'Until withdrawal + 3 years', 'Legal obligation'],
                  ].map(([type, period, basis]) => (
                    <tr key={type}>
                      <td className="px-4 py-2.5 text-gray-300">{type}</td>
                      <td className="px-4 py-2.5 text-gray-400">{period}</td>
                      <td className="px-4 py-2.5 text-gray-500">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              After you request account deletion, your data is <strong className="text-white">soft-deleted immediately</strong> (you
              cannot log in) and <strong className="text-white">hard-deleted within 30 days</strong> via an automated cron job,
              except where legal retention obligations require longer storage.
            </p>
          </Section>

          {/* 5 */}
          <Section id="recipients" title="5. RECIPIENTS &amp; THIRD-PARTY PROCESSORS">
            <p>We share personal data only with the following processors under GDPR-compliant Data Processing Agreements (DPAs):</p>
            <div className="space-y-3">
              {[
                {
                  name: 'Stripe, Inc.',
                  country: 'USA (EU–US DPF)',
                  role: 'Payment processing',
                  data: 'Email address, subscription status',
                  link: 'https://stripe.com/privacy',
                },
                {
                  name: 'Google LLC',
                  country: 'USA (EU–US DPF)',
                  role: 'OAuth authentication (optional)',
                  data: 'Name, email, profile picture',
                  link: 'https://policies.google.com/privacy',
                },
                {
                  name: 'Resend, Inc.',
                  country: 'USA (Standard Contractual Clauses)',
                  role: 'Transactional email delivery',
                  data: 'Email address, name',
                  link: 'https://resend.com/legal/privacy-policy',
                },
                {
                  name: 'Hetzner Online GmbH',
                  country: 'Germany 🇩🇪 (within EU)',
                  role: 'Cloud infrastructure (VPS hosting)',
                  data: 'All data at rest on server',
                  link: 'https://www.hetzner.com/legal/privacy-policy',
                },
              ].map((p) => (
                <div key={p.name} className="border border-white/10 bg-[#111111] p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div><span className="text-gray-500">PROCESSOR: </span><span className="text-white font-bold">{p.name}</span></div>
                  <div><span className="text-gray-500">COUNTRY: </span><span className="text-gray-300">{p.country}</span></div>
                  <div><span className="text-gray-500">ROLE: </span><span className="text-gray-300">{p.role}</span></div>
                  <div><span className="text-gray-500">DATA: </span><span className="text-gray-300">{p.data}</span></div>
                  <div className="sm:col-span-2"><a href={p.link} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">→ Privacy Policy</a></div>
                </div>
              ))}
            </div>
            <p>
              We do not sell your personal data to any third party. We do not use advertising networks or behavioural tracking tools.
            </p>
          </Section>

          {/* 6 */}
          <Section id="transfers" title="6. INTERNATIONAL DATA TRANSFERS">
            <p>
              Our primary server infrastructure is hosted by <strong className="text-white">Hetzner Online GmbH</strong> in
              Germany (EU), meaning your data is stored within the European Economic Area (EEA) by default.
            </p>
            <p>
              Stripe and Google are US-based companies. Data transfers to them are based on
              the <strong className="text-white">EU–US Data Privacy Framework (DPF)</strong>, an adequacy decision by the
              European Commission. Resend transfers are covered by <strong className="text-white">Standard Contractual Clauses (SCCs)</strong> approved
              under Art. 46(2)(c) GDPR.
            </p>
            <p>
              You may request a copy of the applicable transfer safeguards by emailing{' '}
              <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a>.
            </p>
          </Section>

          {/* 7 */}
          <Section id="rights" title="7. YOUR RIGHTS UNDER GDPR (ART. 15–22)">
            <p>As a data subject in the EEA, you have the following rights, which you can exercise at any time:</p>
            <div className="space-y-2">
              {[
                { art: 'Art. 15', right: 'RIGHT OF ACCESS', desc: 'Obtain a copy of all personal data we hold about you.', action: 'Settings → Data & Privacy → Export Data' },
                { art: 'Art. 16', right: 'RIGHT OF RECTIFICATION', desc: 'Correct inaccurate or incomplete personal data.', action: 'Settings → Profile' },
                { art: 'Art. 17', right: 'RIGHT TO ERASURE', desc: 'Request deletion of your personal data ("right to be forgotten").', action: 'Settings → Data & Privacy → Delete Account' },
                { art: 'Art. 18', right: 'RIGHT TO RESTRICTION', desc: 'Request that we restrict processing of your data in certain circumstances.', action: 'Email privacy@aitrackr.io' },
                { art: 'Art. 20', right: 'RIGHT TO DATA PORTABILITY', desc: 'Receive your data in a structured, machine-readable format (JSON).', action: 'Settings → Data & Privacy → Export Data' },
                { art: 'Art. 21', right: 'RIGHT TO OBJECT', desc: 'Object to processing based on legitimate interests or for direct marketing.', action: 'Settings → Email Preferences or email us' },
                { art: 'Art. 22', right: 'AUTOMATED DECISION-MAKING', desc: 'We do not make decisions based solely on automated processing that produce legal or similarly significant effects.', action: 'N/A' },
              ].map((r) => (
                <div key={r.art} className="border border-white/10 bg-[#111111] p-4 space-y-1 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Tag color="green">{r.art}</Tag>
                    <span className="text-white font-bold">{r.right}</span>
                  </div>
                  <p className="text-gray-400">{r.desc}</p>
                  <p className="text-amber-500">→ {r.action}</p>
                </div>
              ))}
            </div>
            <p>
              We will respond to all verified requests within <strong className="text-white">30 days</strong> (extendable by
              a further 60 days for complex requests, with notification). There is no charge for exercising
              your rights unless requests are manifestly unfounded or excessive.
            </p>
          </Section>

          {/* 8 */}
          <Section id="dpa" title="8. RIGHT TO LODGE A COMPLAINT">
            <p>
              If you believe we have processed your personal data unlawfully, you have the right to lodge a complaint
              with a supervisory authority. You may contact the data protection authority in your EU member state,
              or the authority where AiTrackr is established.
            </p>
            <div className="border border-white/10 bg-[#111111] p-4 text-xs font-mono space-y-1">
              <p className="text-white font-bold">Information Commissioner&apos;s Office (ICO) — UK</p>
              <p className="text-gray-400">Website: <a href="https://ico.org.uk" className="text-amber-500 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></p>
              <p className="text-white font-bold mt-3">Slovenian Information Commissioner (IP RS) — if established in Slovenia</p>
              <p className="text-gray-400">Website: <a href="https://www.ip-rs.si/en/" className="text-amber-500 underline" target="_blank" rel="noopener noreferrer">ip-rs.si</a></p>
              <p className="text-gray-500 mt-2 italic">Update with the DPA of the country where your business is registered.</p>
            </div>
            <p>
              We would appreciate the opportunity to address your concerns before you approach a supervisory authority.
              Please contact us first at <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a>.
            </p>
          </Section>

          {/* 9 */}
          <Section id="security" title="9. SECURITY MEASURES">
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>All data transmitted via <strong className="text-white">TLS 1.3</strong> (HTTPS enforced)</li>
              <li>Passwords hashed with <strong className="text-white">bcrypt</strong> (cost factor 12)</li>
              <li>API keys are per-user, stored as hashed values, rate-limited (100 req/15 min)</li>
              <li>Database hosted on encrypted Hetzner VPS in Germany</li>
              <li>No third-party tracking scripts, no analytics cookies</li>
              <li>Automated daily database backups with 30-day retention</li>
              <li>CSRF protection on all state-changing endpoints</li>
            </ul>
            <p>
              In the event of a personal data breach that is likely to result in a risk to your rights and
              freedoms, we will notify the relevant supervisory authority within <strong className="text-white">72 hours</strong> and
              affected users without undue delay, in compliance with GDPR Art. 33–34.
            </p>
          </Section>

          {/* 10 */}
          <Section id="children" title="10. CHILDREN'S DATA">
            <p>
              AiTrackr is not directed at persons under the age of <strong className="text-white">16</strong>. We do not knowingly
              collect personal data from children under 16. If you become aware that a child has provided us with
              personal data, please contact us at <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a> and
              we will delete such information promptly.
            </p>
          </Section>

          {/* 11 */}
          <Section id="changes" title="11. CHANGES TO THIS POLICY">
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we will:
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Update the &quot;Last updated&quot; date at the top of this page</li>
              <li>Send an email notification to registered users if the changes materially affect their rights</li>
              <li>Where required by law, obtain fresh consent</li>
            </ul>
            <p>Continued use of the service after changes become effective constitutes acceptance of the updated policy.</p>
          </Section>

          {/* 12 */}
          <Section id="contact" title="12. CONTACT US">
            <div className="border border-white/10 bg-[#111111] p-4 text-xs font-mono space-y-1">
              <p className="text-white font-bold">Privacy &amp; Data Protection Enquiries</p>
              <p>Email: <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a></p>
              <p>General: <a href="mailto:hello@aitrackr.io" className="text-amber-500 underline">hello@aitrackr.io</a></p>
              <p className="text-gray-500 mt-2">We aim to respond within 48 hours and resolve all requests within 30 days.</p>
            </div>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-xs font-mono text-gray-600">
          <Link href="/" className="hover:text-white transition-colors">← HOME</Link>
          <Link href="/terms" className="hover:text-white transition-colors">TERMS_OF_SERVICE</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">COOKIE_POLICY</Link>
        </div>
      </main>
    </div>
  )
}
