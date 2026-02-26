import Link from 'next/link'
import {
  ArrowRight, Shield, Lock, MessageSquare, Image, Sparkles,
  Clock, Copy, Calculator, Bell, FileText, Download, Activity, Scissors, Check,
  Server, Chrome,
} from 'lucide-react'
import { LandingNav } from '@/components/landing-nav'
import { SUPPORTED_TOOLS_COUNT } from '@/lib/supported-tools'

export default function HomePage() {
  return (
    <div className="antialiased" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
      <LandingNav />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 grid-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-amber-500/30 bg-amber-500/10 mb-8">
                <div className="w-2 h-2 bg-amber-500 animate-pulse rounded-full" />
                <span className="text-xs font-mono text-amber-500">PRIVACY_FIRST_CHROME_EXT</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-white">
                Cut your AI<br />
                bill by{' '}
                <span className="text-amber-500 cursor-blink">40%</span>
              </h1>

              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed border-l-2 border-gray-800 pl-6">
                Automatic tracking for ChatGPT, Claude, Midjourney.
                Detect overlapping subscriptions. Stop bleeding money on unused tools.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
                <Link
                  href="/auth/signup"
                  className="bg-amber-500 text-black px-8 py-4 font-mono font-bold hover:brightness-110 transition-all flex items-center gap-3"
                >
                  GET_STARTED_FREE
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="/auth/signup"
                  className="px-8 py-4 font-mono text-sm border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-3 text-white"
                >
                  SEE_PRICING
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  GDPR_COMPLIANT
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  ZERO_DATA_COLLECTION
                </span>
              </div>
            </div>

            {/* Terminal preview */}
            <div className="relative">
              <div style={{ background: '#111111', border: '1px solid #222222' }} className="p-1">
                <div className="bg-black border border-white/10">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs font-mono text-gray-500">user@aitrackr:~</span>
                    <div className="w-16" />
                  </div>

                  <div className="p-6 font-mono text-sm space-y-4">
                    <div className="text-gray-500">$ aitrackr scan --month=current</div>
                    <div className="text-green-400">[OK] Found 8 active subscriptions</div>
                    <div className="text-amber-500">[WARN] 3 overlapping services detected</div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2 text-xs">
                        <span>SERVICE</span>
                        <span>COST/MO</span>
                        <span>USAGE</span>
                        <span>STATUS</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-white/[0.07]">
                        <span className="text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          ChatGPT Plus
                        </span>
                        <span className="text-gray-300">$20.00</span>
                        <span className="text-green-400">High</span>
                        <span className="text-green-400">[KEEP]</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-white/[0.07] border-l-2 border-l-amber-500 pl-4 -ml-4">
                        <span className="text-white flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Midjourney
                        </span>
                        <span className="text-gray-300">$30.00</span>
                        <span className="text-red-400">Low</span>
                        <span className="text-amber-500">[OVERLAP]</span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Claude Pro
                        </span>
                        <span className="text-gray-300">$20.00</span>
                        <span className="text-green-400">High</span>
                        <span className="text-green-400">[KEEP]</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Potential Monthly Savings:</span>
                        <span className="text-2xl font-bold text-amber-500">$45.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 border border-amber-500/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-white/10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '€2.5K+', label: 'SAVED_THIS_MONTH', amber: true },
              { value: '50+', label: 'ACTIVE_USERS', amber: false },
              { value: String(SUPPORTED_TOOLS_COUNT), label: 'AI_TOOLS_SUPPORTED', amber: false },
              { value: '0', label: 'DATA_BREACHES', amber: false },
            ].map((s) => (
              <div key={s.label}>
                <div className={`text-3xl font-bold font-mono ${s.amber ? 'text-amber-500' : 'text-white'}`}>{s.value}</div>
                <div className="text-xs font-mono text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <span className="text-xs font-mono text-gray-500 block mb-4">// FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Everything you need to<br />optimize spending
            </h2>
            <p className="text-gray-400 max-w-2xl text-lg">
              No fluff. Just the tools you need to track, analyze, and reduce your AI subscription costs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {[
              {
                icon: Clock,
                title: 'AUTO_TRACK',
                desc: 'Chrome extension tracks time spent on AI tools automatically. No manual logging. Zero input required.',
              },
              {
                icon: Copy,
                title: 'OVERLAP_DETECTION',
                desc: 'Identifies redundant subscriptions. Paying for image generation in both ChatGPT and Midjourney? We\'ll flag it.',
              },
              {
                icon: Calculator,
                title: 'COST_PER_HOUR',
                desc: 'See exactly how much you pay per hour of actual usage. Spot the expensive tools you never touch.',
              },
              {
                icon: Bell,
                title: 'RENEWAL_ALERTS',
                desc: 'Get notified 3 days before any subscription renews. Never get surprised by an annual charge again.',
              },
              {
                icon: Shield,
                title: 'ZERO_KNOWLEDGE',
                desc: 'We never see your prompts or generated content. Only metadata: tool name, time spent, cost.',
              },
              {
                icon: FileText,
                title: 'CSV_EXPORT',
                desc: 'Download your usage data anytime. Own your information. Compatible with Excel, Sheets, Notion.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-black p-8 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6">
                  <f.icon className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-mono text-white">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <span className="text-xs font-mono text-gray-500 block mb-4">// SETUP_GUIDE</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Three steps to savings</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: Download,
                title: 'INSTALL_EXT',
                desc: 'Add to Chrome from the Web Store. One click. No configuration needed. Open source code available for audit.',
              },
              {
                num: '02',
                icon: Activity,
                title: 'AUTO_DETECT',
                desc: 'Use your AI tools normally. We detect usage patterns in background. Silent tracking. No interruptions.',
              },
              {
                num: '03',
                icon: Scissors,
                title: 'CUT_COSTS',
                desc: 'Receive weekly report with specific recommendations. Cancel overlaps. Downgrade unused tiers. Save money.',
              },
            ].map((s) => (
              <div key={s.num} className="relative">
                <div className="text-6xl font-mono font-bold text-white/5 absolute -top-8 -left-4 select-none">{s.num}</div>
                <div className="relative border border-white/10 p-8 bg-black h-full">
                  <div className="w-12 h-12 border border-amber-500/50 flex items-center justify-center mb-6 bg-amber-500/10">
                    <s.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-mono text-white">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono text-gray-500 block mb-4">// SECURITY</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                We don&apos;t want<br />your data
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Most tracking apps harvest your content. We built AiTrackr to do the opposite.
                Privacy isn&apos;t a feature—it&apos;s the foundation.
              </p>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-4 p-4 border border-white/10 bg-white/[0.02]">
                  <span className="text-red-500 text-lg font-bold">✕</span>
                  <span className="text-gray-400">We_DO_NOT_STORE: Prompts, Queries, Generated_Content, IP_Addresses</span>
                </div>
                <div className="flex items-center gap-4 p-4 border border-amber-500/30 bg-amber-500/5">
                  <Check className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-gray-300">We_DO_STORE: Tool_Name, Time_Spent, Subscription_Cost</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#111111', border: '1px solid #222222' }} className="p-8">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <span className="font-mono text-sm text-gray-400">DATA_FLOW_DIAGRAM</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 font-mono">ENCRYPTED</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <Chrome className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-amber-500/50" />
                  <div className="w-12 h-12 border border-amber-500/50 flex items-center justify-center bg-amber-500/10">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-white/20" />
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <Server className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs font-mono text-center text-gray-500">
                  <div>Your_Browser</div>
                  <div className="text-amber-500">Local_Processing</div>
                  <div>Our_Server</div>
                </div>

                <div className="mt-6 p-4 bg-black border border-white/10 text-xs font-mono text-gray-400 space-y-1">
                  <div><span className="text-green-400">$</span> All content analysis happens locally.</div>
                  <div><span className="text-green-400">$</span> Only metadata leaves your device.</div>
                  <div><span className="text-green-400">$</span> End-to-end encrypted transmission.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20 text-center">
            <span className="text-xs font-mono text-gray-500 block mb-4">// PRICING</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Simple, transparent</h2>
            <p className="text-gray-400">No hidden fees. No enterprise sales calls.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="border border-white/10 p-8 bg-black">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold font-mono text-white">Free</h3>
                  <p className="text-gray-500 text-sm mt-1">For casual users</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold font-mono text-white">€0</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              </div>

              <ul className="space-y-4 mb-8 font-mono text-sm">
                {['3_subscriptions_max', 'Manual_entry_only', 'Basic_analytics', 'Community_support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="block w-full py-4 border border-white/20 font-mono font-bold hover:bg-white/5 transition-all text-center text-white"
              >
                SELECT_FREE
              </Link>
            </div>

            {/* Pro */}
            <div className="border border-amber-500/50 p-8 bg-black relative">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-mono font-bold px-3 py-1">
                RECOMMENDED
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold font-mono text-amber-500">Pro</h3>
                  <p className="text-gray-500 text-sm mt-1">For power users</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold font-mono text-white">€8</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              </div>

              <ul className="space-y-4 mb-8 font-mono text-sm">
                {[
                  'Unlimited_subscriptions',
                  'Chrome_extension_auto_track',
                  'Overlap_detection_engine',
                  'CSV_export_API_access',
                  'Priority_email_support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="block w-full py-4 bg-amber-500 text-black font-mono font-bold hover:brightness-110 transition-all text-center"
              >
                UPGRADE_TO_PRO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <Activity className="w-4 h-4 text-black" />
              </div>
              <span className="font-mono font-bold text-white">AiTrackr</span>
              <span className="text-gray-600 text-sm font-mono">© 2026</span>
            </div>

            <div className="flex items-center gap-6 text-sm font-mono text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
              <a
                href="mailto:info@aitrackr.io"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
