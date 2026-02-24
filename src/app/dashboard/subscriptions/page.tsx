'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema, type SubscriptionInput } from '@/lib/validations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'
import { formatDate, calculateCostPerHour } from '@/lib/utils'
import { formatMoney } from '@/lib/currencies'
import type { Subscription } from '@prisma/client'

const CATEGORIES = ['ALL', 'TEXT_GEN', 'IMAGE_GEN', 'CODE', 'VIDEO', 'AUDIO', 'RESEARCH', 'OTHER'] as const

const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'All', TEXT_GEN: 'Text Gen', IMAGE_GEN: 'Image Gen', CODE: 'Code',
  VIDEO: 'Video', AUDIO: 'Audio', RESEARCH: 'Research', OTHER: 'Other',
}

export default function SubscriptionsPage() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [category, setCategory] = useState('ALL')

  const form = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '', provider: '', cost: 0, billingCycle: 'MONTHLY',
      category: 'TEXT_GEN', features: ['chat'], url: '', notes: '',
      nextBillingDate: new Date().toISOString().split('T')[0]!,
    },
  })

  async function load() {
    const res = await fetch('/api/subscriptions')
    if (res.ok) {
      const data = await res.json() as { subscriptions: Subscription[] }
      setSubscriptions(data.subscriptions)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    form.reset()
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(sub: Subscription) {
    setEditing(sub)
    form.reset({
      name: sub.name, provider: sub.provider,
      cost: Number(sub.cost),
      billingCycle: sub.billingCycle,
      category: sub.category,
      features: sub.features as string[],
      url: sub.url ?? '',
      notes: sub.notes ?? '',
      nextBillingDate: new Date(sub.nextBillingDate).toISOString().split('T')[0]!,
    })
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      toast.success('Subscription deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  async function onSubmit(data: SubscriptionInput) {
    const method = editing ? 'PUT' : 'POST'
    const body = editing ? { ...data, id: editing.id } : data

    const res = await fetch('/api/subscriptions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      toast.success(editing ? 'Subscription updated' : 'Subscription added')
      setModalOpen(false)
      load()
    } else {
      const err = await res.json() as { error?: string }
      toast.error(err.error ?? 'Failed to save')
    }
  }

  const filtered = category === 'ALL'
    ? subscriptions
    : subscriptions.filter((s) => s.category === category)

  const isFreeLimitReached =
    session?.user?.subscriptionStatus === 'FREE' && subscriptions.length >= 3

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">
            {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
            {session?.user?.subscriptionStatus === 'FREE' && (
              <span className="ml-1 text-xs">(Free plan: {subscriptions.length}/3)</span>
            )}
          </p>
        </div>
        <Button onClick={openAdd} disabled={isFreeLimitReached}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {isFreeLimitReached && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm">
            You&apos;ve reached the free plan limit.{' '}
            <a href="/pricing" className="text-primary font-medium hover:underline">
              Upgrade to Pro
            </a>{' '}
            for unlimited subscriptions.
          </p>
        </div>
      )}

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{CATEGORY_LABELS[cat]}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <DollarSign className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No subscriptions yet</p>
            <Button onClick={openAdd} variant="outline" size="sm">
              Add your first subscription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sub) => (
            <Card key={sub.id} className="group relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{sub.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{sub.provider}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(sub)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(sub.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{formatMoney(Number(sub.cost), session?.user?.currency)}</span>
                  <span className="text-xs text-muted-foreground mb-1">
                    /{sub.billingCycle === 'YEARLY' ? 'year' : 'mo'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(sub.features as string[]).map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Renews {formatDate(sub.nextBillingDate)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="ChatGPT Plus" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="provider" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <FormControl><Input placeholder="OpenAI" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="cost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="billingCycle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CATEGORIES.filter(c => c !== 'ALL').map((cat) => (
                          <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nextBillingDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Billing Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (optional)</FormLabel>
                  <FormControl><Input placeholder="https://openai.com/chatgpt" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
