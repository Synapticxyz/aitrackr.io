import type { Metadata } from 'next'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — AiTrackr',
  description: 'AiTrackr Terms of Service. Read about your rights, subscription terms, cancellation, and EU consumer protections.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-base font-bold font-mono text-white border-l-2 border-amber-500 pl-3">{title}</h2>
      <div className="space-y-3 text-sm text-gray-400 leading-relaxed pl-3">{children}</div>
    </section>
  )
}

export default function TermsPage() {
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
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-amber-500 mb-2">// LEGAL</p>
          <h1 className="text-3xl font-bold font-mono text-white mb-2">TERMS_OF_SERVICE</h1>
          <p className="text-sm font-mono text-gray-500">Last updated: {updated} · Effective immediately</p>
          <div className="mt-4 p-4 border border-blue-500/20 bg-blue-500/5 text-xs font-mono text-blue-400 space-y-1">
            <p>✓ These Terms comply with Directive 2011/83/EU (Consumer Rights Directive)</p>
            <p>✓ These Terms comply with Directive 2000/31/EC (E-Commerce Directive)</p>
            <p>✓ These Terms comply with Regulation (EU) 2022/2065 (Digital Services Act)</p>
          </div>
        </div>

        <div className="space-y-10">

          {/* 1 */}
          <Section id="parties" title="1. PARTIES &amp; SERVICE PROVIDER IDENTITY">
            <p>These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between:</p>
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-1">
              <p className="text-white font-bold">Service Provider</p>
              <p>InteQ, Sašo Kranjec s.p.</p>
              <p>Škofljica, Slovenia</p>
              <p>VAT ID: SI18095216</p>
              <p>Contact: <a href="mailto:info@aitrackr.io" className="text-amber-500 underline">info@aitrackr.io</a></p>
            </div>
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-1">
              <p className="text-white font-bold">User / Customer (&quot;you&quot;)</p>
              <p className="text-gray-400">
                Any individual or legal entity that creates an account and uses the AiTrackr service.
                If you are a <strong className="text-white">consumer</strong> (an individual acting for purposes outside your trade, business,
                craft, or profession), the consumer-specific rights in these Terms apply to you.
              </p>
            </div>
          </Section>

          {/* 2 */}
          <Section id="acceptance" title="2. ACCEPTANCE OF TERMS">
            <p>
              By creating an account or using AiTrackr, you confirm that you have read, understood, and agree
              to these Terms and our <Link href="/privacy" className="text-amber-500 underline">Privacy Policy</Link> and{' '}
              <Link href="/cookies" className="text-amber-500 underline">Cookie Policy</Link>.
            </p>
            <p>
              If you do not agree, you must not use the service. We recommend you download and save a copy of
              these Terms for your records.
            </p>
            <p>
              You must be at least <strong className="text-white">16 years old</strong> to use AiTrackr. By accepting these Terms,
              you confirm you meet this requirement.
            </p>
          </Section>

          {/* 3 */}
          <Section id="service" title="3. DESCRIPTION OF SERVICE">
            <p>
              AiTrackr is a Software-as-a-Service (SaaS) web application that allows users to:
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Manually track AI tool subscriptions (costs, billing dates, features)</li>
              <li>Automatically track time spent on supported AI tools via a Chrome extension (Pro plan)</li>
              <li>Visualise usage analytics and detect cost-saving opportunities (overlap detection)</li>
              <li>Receive renewal reminder emails</li>
            </ul>
            <p>
              AiTrackr is an independent service and is <strong className="text-white">not affiliated with, endorsed by, or
              partnered with</strong> any AI tool provider, including OpenAI, Anthropic, Google, Microsoft, or
              any other company whose tools may be tracked.
            </p>
          </Section>

          {/* 4 */}
          <Section id="accounts" title="4. USER ACCOUNTS">
            <p>To use AiTrackr, you must create an account. You agree to:</p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Provide accurate, complete, and current registration information</li>
              <li>Maintain the security of your password and not share your account</li>
              <li>Promptly notify us of any unauthorised access at <a href="mailto:info@aitrackr.io" className="text-amber-500 underline">info@aitrackr.io</a></li>
              <li>Maintain only one account per person (duplicate accounts may be suspended)</li>
            </ul>
            <p>
              You are responsible for all activity that occurs under your account. We are not liable for
              any loss resulting from unauthorised use of your account.
            </p>
          </Section>

          {/* 5 */}
          <Section id="plans" title="5. PLANS, PRICING &amp; BILLING">
            <div className="space-y-3">
              <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-2">
                <p className="text-white font-bold">FREE PLAN — €0/month</p>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-400">
                  <li>Up to 3 subscription entries</li>
                  <li>Manual subscription tracking only</li>
                  <li>Basic usage analytics</li>
                  <li>Data export and account deletion (GDPR rights)</li>
                </ul>
              </div>
              <div className="border border-amber-500/20 bg-amber-500/5 p-4 font-mono text-xs space-y-2">
                <p className="text-amber-500 font-bold">PRO PLAN</p>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-400">
                  <li>Monthly: <strong className="text-white">€8 / month</strong></li>
                  <li>Annual: <strong className="text-white">€79 / year</strong> (save ~18%)</li>
                  <li>Unlimited subscriptions, Chrome extension, advanced analytics, overlap detection</li>
                </ul>
              </div>
            </div>
            <p>
              All prices are shown in EUR and are <strong className="text-white">exclusive of VAT/taxes</strong>. If you are subject
              to VAT in the EU, applicable taxes will be added at checkout as required by Directive 2006/112/EC.
            </p>
            <p>
              Payment is processed by <strong className="text-white">Stripe</strong>. Subscriptions automatically renew unless
              cancelled before the renewal date. We will send a renewal reminder at least 3 days before charging.
            </p>
            <p>
              We reserve the right to change prices with <strong className="text-white">at least 30 days&apos; prior written notice</strong> by
              email. Price increases will not affect your current billing period.
            </p>
          </Section>

          {/* 6 — KEY EU section */}
          <Section id="withdrawal" title="6. RIGHT OF WITHDRAWAL (EU CONSUMERS — 14 DAYS)">
            <div className="border border-green-500/20 bg-green-500/5 p-4 text-xs font-mono space-y-2">
              <p className="text-green-400 font-bold">CONSUMER RIGHTS DIRECTIVE 2011/83/EU — ART. 9</p>
              <p className="text-gray-300">
                If you are a consumer in the European Union, you have the right to withdraw from a paid subscription
                contract <strong className="text-white">within 14 days</strong> from the date your subscription begins, without giving any reason.
              </p>
            </div>
            <p>
              <strong className="text-white">Waiver:</strong> By starting to use Pro plan features immediately after subscribing, you
              expressly request that we begin performing the service before the 14-day withdrawal period expires.
              If you later exercise your right of withdrawal, we are entitled to a <strong className="text-white">pro-rata charge</strong> for
              the service actually provided up to the point of withdrawal.
            </p>
            <p>
              <strong className="text-white">How to withdraw:</strong> Send an unambiguous statement to{' '}
              <a href="mailto:info@aitrackr.io" className="text-amber-500 underline">info@aitrackr.io</a>{' '}
              or use the model withdrawal form below. We will confirm receipt within 48 hours and process your
              refund within 14 days via the original payment method.
            </p>
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-1">
              <p className="text-white font-bold">MODEL WITHDRAWAL FORM (Art. 11(1) Annex I, Part B)</p>
              <p className="text-gray-500 mt-2 italic">To: AiTrackr, info@aitrackr.io</p>
              <p className="text-gray-500 italic">I hereby give notice that I withdraw from my contract for the purchase of the following service:</p>
              <p className="text-gray-500 italic">[ Pro plan — Monthly / Annual ]</p>
              <p className="text-gray-500 italic">Ordered on: [ date ]</p>
              <p className="text-gray-500 italic">Name: [ full name ]</p>
              <p className="text-gray-500 italic">Email used to sign up: [ email ]</p>
              <p className="text-gray-500 italic">Signature / Date: [ date ]</p>
            </div>
          </Section>

          {/* 7 */}
          <Section id="cancellation" title="7. CANCELLATION &amp; REFUNDS">
            <p>
              You may cancel your Pro subscription at any time from <strong className="text-white">Settings → Billing → Manage Billing</strong>.
              Cancellation takes effect at the end of the current billing period — you retain Pro access until then.
            </p>
            <p>
              <strong className="text-white">Outside the withdrawal window:</strong> We do not offer refunds for partial billing periods
              after the 14-day withdrawal period has expired, unless required by applicable law. We may grant
              goodwill refunds at our discretion in exceptional circumstances.
            </p>
            <p>
              If we terminate your account for a breach of these Terms, no refund will be issued for the remaining
              subscription period.
            </p>
          </Section>

          {/* 8 */}
          <Section id="acceptable-use" title="8. ACCEPTABLE USE">
            <p>You agree not to:</p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Attempt to reverse engineer, decompile, or extract source code from the service</li>
              <li>Use automated tools (scrapers, bots) to extract data from the service at scale</li>
              <li>Create multiple accounts to circumvent Free plan limits</li>
              <li>Use the service for any unlawful purpose or in violation of any applicable law</li>
              <li>Interfere with or disrupt the integrity or performance of the service</li>
              <li>Attempt to bypass rate limits or security measures</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
            </ul>
            <p>
              Violation of this section may result in immediate account suspension or termination without
              notice and without refund.
            </p>
          </Section>

          {/* 9 */}
          <Section id="ip" title="9. INTELLECTUAL PROPERTY">
            <p>
              All rights, title, and interest in the AiTrackr service (including its source code, design,
              trademarks, and content) are owned by or licensed to AiTrackr. These Terms do not grant you
              any intellectual property rights in the service.
            </p>
            <p>
              <strong className="text-white">Your data:</strong> You retain full ownership of all data you enter into AiTrackr
              (subscription records, usage data). You grant us a limited licence to process that data solely
              for the purpose of providing the service to you.
            </p>
          </Section>

          {/* 10 */}
          <Section id="availability" title="10. SERVICE AVAILABILITY &amp; WARRANTIES">
            <p>
              We aim for high availability but provide the service <strong className="text-white">&quot;as is&quot;</strong> without
              warranty of uninterrupted or error-free operation. Planned maintenance will be announced in advance
              where practicable.
            </p>
            <p>
              <strong className="text-white">For consumers in the EU</strong>, nothing in these Terms affects your statutory rights
              under applicable consumer protection law, including rights arising from Directive 2019/770/EU on
              contracts for the supply of digital content and digital services.
            </p>
          </Section>

          {/* 11 */}
          <Section id="liability" title="11. LIMITATION OF LIABILITY">
            <p>
              To the maximum extent permitted by applicable law, AiTrackr shall not be liable for:
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>Loss of profits, revenue, or business</li>
              <li>Indirect, incidental, consequential, or punitive damages</li>
              <li>Any losses arising from your reliance on the service&apos;s recommendations (overlap detection, savings suggestions)</li>
            </ul>
            <p>
              Our total aggregate liability to you for any claim arising out of or relating to these Terms
              shall not exceed the <strong className="text-white">greater of (a) the total fees you paid us in the 12 months
              preceding the claim, or (b) €100</strong>.
            </p>
            <p>
              <strong className="text-white">EU consumers:</strong> Nothing in this clause limits our liability for death or
              personal injury caused by negligence, fraudulent misrepresentation, or any liability that
              cannot be excluded under mandatory consumer law.
            </p>
          </Section>

          {/* 12 */}
          <Section id="termination" title="12. ACCOUNT SUSPENSION &amp; TERMINATION">
            <p>
              <strong className="text-white">By you:</strong> You may delete your account at any time from Settings → Data &amp; Privacy.
              Your data will be soft-deleted immediately and hard-deleted within 30 days (see Privacy Policy §4).
            </p>
            <p>
              <strong className="text-white">By us:</strong> We may suspend or terminate your account if you breach these Terms,
              engage in fraudulent activity, or fail to pay applicable fees. We will give you reasonable notice
              except where immediate termination is required to prevent harm or where prohibited by law.
            </p>
            <p>
              Upon termination, your right to access the service ceases. Sections 9, 11, 13, and 14 survive termination.
            </p>
          </Section>

          {/* 13 */}
          <Section id="changes" title="13. CHANGES TO THESE TERMS">
            <p>
              We may update these Terms to reflect changes to the law, our service, or our business.
              For <strong className="text-white">material changes</strong>:
            </p>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>We will give you at least <strong className="text-white">30 days&apos; advance notice</strong> by email</li>
              <li>You have the right to terminate your account before the changes take effect</li>
              <li>Continued use after the effective date constitutes acceptance</li>
            </ul>
          </Section>

          {/* 14 — KEY EU section */}
          <Section id="governing-law" title="14. GOVERNING LAW &amp; DISPUTE RESOLUTION">
            <p>
              These Terms are governed by the laws of <strong className="text-white">Slovenia</strong>,
              without regard to its conflict-of-law principles.
            </p>
            <p>
              <strong className="text-white">EU consumers</strong> always retain the benefit of the mandatory provisions of the
              consumer protection laws of their country of residence, regardless of the governing law clause.
            </p>
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-2">
              <p className="text-white font-bold">ONLINE DISPUTE RESOLUTION (EU)</p>
              <p className="text-gray-400">
                The European Commission provides an Online Dispute Resolution (ODR) platform for consumers:
              </p>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">
                https://ec.europa.eu/consumers/odr
              </a>
              <p className="text-gray-400 mt-1">
                Our email for ODR purposes: <a href="mailto:info@aitrackr.io" className="text-amber-500 underline">info@aitrackr.io</a>
              </p>
              <p className="text-gray-500 mt-1 italic">
                Note: We are not obliged to and do not currently participate in an Alternative Dispute Resolution (ADR) scheme.
                We prefer to resolve disputes directly — please contact us first.
              </p>
            </div>
          </Section>

          {/* 15 */}
          <Section id="miscellaneous" title="15. MISCELLANEOUS">
            <p>
              <strong className="text-white">Severability:</strong> If any provision of these Terms is found to be unenforceable,
              the remaining provisions will continue in full force and effect.
            </p>
            <p>
              <strong className="text-white">Waiver:</strong> Our failure to enforce any provision does not constitute a waiver of
              our right to enforce it in the future.
            </p>
            <p>
              <strong className="text-white">Entire Agreement:</strong> These Terms, together with the Privacy Policy and Cookie
              Policy, constitute the entire agreement between you and AiTrackr regarding the service.
            </p>
            <p>
              <strong className="text-white">Language:</strong> These Terms are written in English. Where required by local law,
              a translation will be provided. In case of conflict between a translation and the English
              version, the English version prevails.
            </p>
          </Section>

          {/* 16 */}
          <Section id="contact-terms" title="16. CONTACT">
            <div className="border border-white/10 bg-[#111111] p-4 font-mono text-xs space-y-1">
              <p className="text-white font-bold">AiTrackr</p>
              <p>General enquiries: <a href="mailto:info@aitrackr.io" className="text-amber-500 underline">info@aitrackr.io</a></p>
              <p>Legal &amp; privacy: <a href="mailto:privacy@aitrackr.io" className="text-amber-500 underline">privacy@aitrackr.io</a></p>
              <p>Billing &amp; refunds: <a href="mailto:billing@aitrackr.io" className="text-amber-500 underline">billing@aitrackr.io</a></p>
            </div>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-xs font-mono text-gray-600">
          <Link href="/" className="hover:text-white transition-colors">← HOME</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY_POLICY</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">COOKIE_POLICY</Link>
        </div>
      </main>
    </div>
  )
}
