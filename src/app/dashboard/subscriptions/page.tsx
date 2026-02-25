'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema, type SubscriptionInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatMoney } from '@/lib/currencies'
import type { Subscription } from '@prisma/client'
import Link from 'next/link'

const CATEGORIES = ['ALL', 'TEXT_GEN', 'IMAGE_GEN', 'CODE', 'VIDEO', 'AUDIO', 'RESEARCH', 'OTHER'] as const
const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'ALL', TEXT_GEN: 'TEXT_GEN', IMAGE_GEN: 'IMAGE_GEN', CODE: 'CODE',
  VIDEO: 'VIDEO', AUDIO: 'AUDIO', RESEARCH: 'RESEARCH', OTHER: 'OTHER',
}

const inputCls = 'font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50'

export default function SubscriptionsPage() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [category, setCategory] = useState('ALL')

  const form = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { name: '', provider: '', cost: 0, billingCycle: 'MONTHLY', category: 'TEXT_GEN', features: ['chat'], url: '', notes: '', nextBillingDate: new Date().toISOString().split('T')[0]! },
  })

  async function load() {
    const res = await fetch('/api/subscriptions')
    if (res.ok) setSubscriptions((await res.json() as { subscriptions: Subscription[] }).subscriptions)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() { form.reset(); setEditing(null); setModalOpen(true) }
  function openEdit(sub: Subscription) {
    setEditing(sub)
    form.reset({ name: sub.name, provider: sub.provider, cost: Number(sub.cost), billingCycle: sub.billingCycle, category: sub.category, features: sub.features as string[], url: sub.url ?? '', notes: sub.notes ?? '', nextBillingDate: new Date(sub.nextBillingDate).toISOString().split('T')[0]! })
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' })
    if (res.ok) { setSubscriptions((prev) => prev.filter((s) => s.id !== id)); toast.success('Subscription deleted') }
    else toast.error('Failed to delete')
  }

  async function onSubmit(data: SubscriptionInput) {
    const res = await fetch('/api/subscriptions', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { ...data, id: editing.id } : data),
    })
    if (res.ok) { toast.success(editing ? 'Updated' : 'Added'); setModalOpen(false); load() }
    else toast.error((await res.json() as { error?: string }).error ?? 'Failed to save')
  }

  const filtered = category === 'ALL' ? subscriptions : subscriptions.filter((s) => s.category === category)
  const isFreeLimitReached = session?.user?.subscriptionStatus === 'FREE' && subscriptions.length >= 3
  const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.billingCycle === 'YEARLY' ? Number(s.cost) / 12 : Number(s.cost)), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500">// MANAGE</p>
          <h1 className="text-2xl font-bold font-mono text-white mt-1">SUBSCRIPTIONS</h1>
          <p className="text-sm font-mono text-gray-400">
            {subscriptions.length} active · {formatMoney(totalMonthly, session?.user?.currency)}/mo
            {session?.user?.subscriptionStatus === 'FREE' && <span className="ml-2 text-amber-500">({subscriptions.length}/3 free)</span>}
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={isFreeLimitReached}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          ADD_SUB
        </button>
      </div>

      {isFreeLimitReached && (
        <div className="p-4 border border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-mono text-gray-300">
            Free plan limit reached.{' '}
            <Link href="/pricing" className="text-amber-500 hover:text-amber-400">UPGRADE_TO_PRO</Link>
            {' '}for unlimited subscriptions.
          </p>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-0 border border-white/10 w-fit overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-2 text-xs font-mono transition-colors whitespace-nowrap ${category === cat ? 'bg-amber-500 text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5 border-r border-white/10 last:border-0'}`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-px md:grid-cols-2 lg:grid-cols-3 bg-white/5">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-[#111111] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/10 flex flex-col items-center justify-center py-16 gap-3">
          <DollarSign className="h-8 w-8 text-gray-700" />
          <p className="text-sm font-mono text-gray-500">NO_SUBSCRIPTIONS_YET</p>
          <button onClick={openAdd} className="px-4 py-2 border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:border-white/20 transition-all">
            + ADD_FIRST_SUBSCRIPTION
          </button>
        </div>
      ) : (
        <div className="grid gap-px md:grid-cols-2 lg:grid-cols-3 bg-white/10 border border-white/10">
          {filtered.map((sub) => (
            <div key={sub.id} className="bg-[#111111] p-5 group hover:bg-[#151515] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-white text-sm">{sub.name}</p>
                  <p className="text-xs font-mono text-gray-500">{sub.provider}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(sub)} className="p-1.5 text-gray-600 hover:text-white transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-amber-500 mb-3">
                {formatMoney(Number(sub.cost), session?.user?.currency)}
                <span className="text-xs text-gray-500 ml-1">/{sub.billingCycle === 'YEARLY' ? 'yr' : 'mo'}</span>
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(sub.features as string[]).map((f) => (
                  <span key={f} className="px-1.5 py-0.5 text-xs font-mono bg-white/5 text-gray-400 border border-white/10">{f}</span>
                ))}
              </div>
              <p className="text-xs font-mono text-gray-600">RENEWS: {formatDate(sub.nextBillingDate)}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg bg-[#111111] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="font-mono text-white">{editing ? 'EDIT_SUBSCRIPTION' : 'ADD_SUBSCRIPTION'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">NAME</FormLabel><FormControl><Input placeholder="ChatGPT Plus" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="provider" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">PROVIDER</FormLabel><FormControl><Input placeholder="OpenAI" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="cost" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">COST ($)</FormLabel><FormControl>
                    <Input type="number" step="0.01" min="0" className={inputCls} {...field} onChange={(e) => { const v = parseFloat(e.target.value); field.onChange(isNaN(v) ? '' : v) }} />
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="billingCycle" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">BILLING</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className={inputCls}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="bg-[#111111] border-white/10 font-mono text-white">
                        <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                        <SelectItem value="YEARLY">YEARLY</SelectItem>
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">CATEGORY</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className={inputCls}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="bg-[#111111] border-white/10 font-mono text-white">
                        {CATEGORIES.filter(c => c !== 'ALL').map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nextBillingDate" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs font-mono text-gray-400">NEXT_BILLING</FormLabel><FormControl><Input type="date" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-mono text-gray-400">URL (OPTIONAL)</FormLabel><FormControl><Input placeholder="https://openai.com" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-all">CANCEL</button>
                <button type="submit" disabled={form.formState.isSubmitting} className="px-4 py-2 bg-amber-500 text-black text-xs font-mono font-bold hover:brightness-110 transition-all disabled:opacity-60">
                  {form.formState.isSubmitting ? 'SAVING...' : editing ? 'UPDATE' : 'ADD'}
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
