'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DeleteAccountModal } from '@/components/delete-account-modal'
import { toast } from 'sonner'
import { Download, ExternalLink, Sparkles } from 'lucide-react'
import { CURRENCIES } from '@/lib/currencies'

const inputCls = 'font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-[#111111]">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs font-mono font-bold text-white">{label}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [currency, setCurrency] = useState(session?.user?.currency ?? 'USD')
  const [renewalAlerts, setRenewalAlerts] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
    if (session?.user?.currency) setCurrency(session.user.currency)
  }, [session])

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, currency, emailPreferences: { renewalAlerts, marketing } }) })
      if (res.ok) { await update(); toast.success('Profile updated') } else toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/user/export')
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'aitrackr-data-export.json'; a.click()
        toast.success('Data export downloaded')
      }
    } finally { setExporting(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-mono text-gray-500">// ACCOUNT</p>
        <h1 className="text-2xl font-bold font-mono text-white mt-1">SETTINGS</h1>
        <p className="text-sm font-mono text-gray-400">Manage your account preferences</p>
      </div>

      <Section label="PROFILE">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-gray-400">DISPLAY_NAME</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-gray-400">EMAIL</Label>
            <Input value={session?.user?.email ?? ''} disabled className={`${inputCls} opacity-50`} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-gray-400">DISPLAY_CURRENCY</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111111] border-white/10 font-mono text-white max-h-72">
                {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs font-mono text-gray-600">All costs displayed in this currency</p>
          </div>
          <div className="space-y-3 pt-1">
            <Label className="text-xs font-mono text-gray-400">EMAIL_PREFERENCES</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-white">RENEWAL_ALERTS</p>
                <p className="text-xs font-mono text-gray-500">3 days before subscriptions renew</p>
              </div>
              <Switch checked={renewalAlerts} onCheckedChange={setRenewalAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-white">MARKETING_EMAILS</p>
                <p className="text-xs font-mono text-gray-500">Product updates and tips</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60"
          >
            {saving ? 'SAVING...' : 'SAVE_CHANGES'}
          </button>
        </div>
      </Section>

      <Section label="BILLING">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-white">CURRENT_PLAN</p>
              <p className="text-xs font-mono text-gray-500">
                {session?.user?.subscriptionStatus === 'PRO' ? 'AiTrackr Pro — €8/month' : 'Free Plan'}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-mono font-bold ${session?.user?.subscriptionStatus === 'PRO' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
              {session?.user?.subscriptionStatus === 'PRO' ? <><Sparkles className="inline h-3 w-3 mr-1" />PRO</> : 'FREE'}
            </span>
          </div>
          {session?.user?.subscriptionStatus === 'PRO' ? (
            <button
              onClick={async () => { const res = await fetch('/api/stripe/portal', { method: 'POST' }); if (res.ok) { const { url } = await res.json() as { url: string }; window.open(url, '_blank') } }}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-white/20 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              MANAGE_BILLING
            </button>
          ) : (
            <button onClick={() => window.location.href = '/pricing'} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all">
              <Sparkles className="h-4 w-4" />
              UPGRADE_TO_PRO
            </button>
          )}
        </div>
      </Section>

      <Section label="DATA_AND_PRIVACY">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-mono text-white mb-1">EXPORT_YOUR_DATA</p>
            <p className="text-xs font-mono text-gray-500 mb-3">
              Download all your data in JSON format (GDPR Art. 20 — Right to Data Portability)
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-white/20 transition-all disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {exporting ? 'PREPARING...' : 'EXPORT_DATA'}
            </button>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-sm font-mono text-red-400 mb-1">DELETE_ACCOUNT</p>
            <p className="text-xs font-mono text-gray-500 mb-3">
              Permanently deletes your account within 30 days (GDPR Art. 17 — Right to Erasure)
            </p>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2.5 border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
            >
              DELETE_ACCOUNT
            </button>
          </div>
        </div>
      </Section>

      <DeleteAccountModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  )
}
