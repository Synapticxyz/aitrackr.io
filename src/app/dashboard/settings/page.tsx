'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DeleteAccountModal } from '@/components/delete-account-modal'
import { toast } from 'sonner'
import { Download, ExternalLink, Sparkles } from 'lucide-react'
import { CURRENCIES } from '@/lib/currencies'

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
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currency, emailPreferences: { renewalAlerts, marketing } }),
      })
      if (res.ok) {
        await update()
        toast.success('Profile updated')
      } else {
        toast.error('Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/user/export')
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'aitrackr-data-export.json'
        a.click()
        toast.success('Data export downloaded')
      }
    } finally {
      setExporting(false)
    }
  }

  async function openBillingPortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    if (res.ok) {
      const { url } = await res.json() as { url: string }
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={session?.user?.email ?? ''} disabled className="opacity-70" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Display Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">All costs will be displayed in this currency</p>
          </div>
          <div className="space-y-3">
            <Label>Email Preferences</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Renewal Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified 3 days before subscriptions renew</p>
              </div>
              <Switch checked={renewalAlerts} onCheckedChange={setRenewalAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Marketing Emails</p>
                <p className="text-xs text-muted-foreground">Product updates and tips</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.subscriptionStatus === 'PRO' ? 'AiTrackr Pro — $8/month' : 'Free Plan'}
              </p>
            </div>
            <Badge variant={session?.user?.subscriptionStatus === 'PRO' ? 'default' : 'secondary'}>
              {session?.user?.subscriptionStatus === 'PRO' ? (
                <><Sparkles className="h-3 w-3 mr-1" />Pro</>
              ) : 'Free'}
            </Badge>
          </div>
          {session?.user?.subscriptionStatus === 'PRO' ? (
            <Button variant="outline" onClick={openBillingPortal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Billing
            </Button>
          ) : (
            <Button onClick={() => window.location.href = '/pricing'}>
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>GDPR rights: access, export, and delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Export Your Data</p>
            <p className="text-xs text-muted-foreground mb-3">
              Download all your data in JSON format (GDPR Art. 20 — Right to Data Portability)
            </p>
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Preparing export...' : 'Export Data'}
            </Button>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-1 text-destructive">Delete Account</p>
            <p className="text-xs text-muted-foreground mb-3">
              Permanently delete your account and all data within 30 days (GDPR Art. 17 — Right to Erasure)
            </p>
            <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  )
}
