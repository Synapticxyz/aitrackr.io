import { prisma } from '@/lib/prisma'
import type { Subscription, UsageLog } from '@prisma/client'

interface OverlapResult {
  type: 'DUPLICATE_CAPABILITY' | 'UNUSED_SUBSCRIPTION' | 'WRONG_TIER'
  description: string
  affectedSubscriptionIds: string[]
  potentialSavings: number
}

export async function detectOverlaps(userId: string): Promise<OverlapResult[]> {
  const [subscriptions, recentUsage] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId, isActive: true, isDeleted: false },
    }),
    prisma.usageLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])

  const results: OverlapResult[] = []

  results.push(...detectDuplicateCapabilities(subscriptions))
  results.push(...detectUnusedSubscriptions(subscriptions, recentUsage))
  results.push(...detectWrongTier(subscriptions, recentUsage))

  return results
}

function detectDuplicateCapabilities(subscriptions: Subscription[]): OverlapResult[] {
  const results: OverlapResult[] = []
  const featureMap = new Map<string, Subscription[]>()

  for (const sub of subscriptions) {
    const features = sub.features as string[]
    for (const feature of features) {
      const existing = featureMap.get(feature) ?? []
      existing.push(sub)
      featureMap.set(feature, existing)
    }
  }

  const processed = new Set<string>()

  for (const [feature, subs] of Array.from(featureMap.entries())) {
    if (subs.length < 2) continue

    const key = subs
      .map((s: { id: string }) => s.id)
      .sort()
      .join(':')
    if (processed.has(key)) continue
    processed.add(key)

    const sorted = [...subs].sort((a, b) => Number(a.cost) - Number(b.cost))
    const cheapest = sorted[0]!
    const savings = sorted.slice(1).reduce((sum: number, s) => sum + Number(s.cost), 0)

    results.push({
      type: 'DUPLICATE_CAPABILITY',
      description: `You have ${subs.length} subscriptions with "${feature}" capability: ${subs.map((s) => s.name).join(', ')}. Consider keeping only ${cheapest.name}.`,
      affectedSubscriptionIds: subs.map((s) => s.id),
      potentialSavings: savings,
    })
  }

  return results
}

function detectUnusedSubscriptions(
  subscriptions: Subscription[],
  recentUsage: UsageLog[]
): OverlapResult[] {
  const usedTools = new Set(recentUsage.map((u) => u.tool.toLowerCase()))

  return subscriptions
    .filter((sub) => {
      const toolName = sub.provider.toLowerCase()
      const subName = sub.name.toLowerCase()
      return !usedTools.has(toolName) && !usedTools.has(subName)
    })
    .map((sub) => ({
      type: 'UNUSED_SUBSCRIPTION' as const,
      description: `${sub.name} hasn't been used in the last 14 days. You could save ${formatCost(Number(sub.cost))}/month by cancelling it.`,
      affectedSubscriptionIds: [sub.id],
      potentialSavings: Number(sub.cost),
    }))
}

function detectWrongTier(
  subscriptions: Subscription[],
  recentUsage: UsageLog[]
): OverlapResult[] {
  const results: OverlapResult[] = []

  for (const sub of subscriptions) {
    const toolUsage = recentUsage.filter(
      (u) =>
        u.tool.toLowerCase() === sub.provider.toLowerCase() ||
        u.tool.toLowerCase() === sub.name.toLowerCase()
    )

    const totalHours = toolUsage.reduce((sum, u) => sum + u.durationSeconds, 0) / 3600

    // If paying >$15/month but using less than 2 hours over 14 days — likely wrong tier
    if (Number(sub.cost) > 15 && totalHours < 2) {
      results.push({
        type: 'WRONG_TIER',
        description: `You're paying ${formatCost(Number(sub.cost))}/month for ${sub.name} but only used it for ${totalHours.toFixed(1)} hours in the last 14 days. A free or lower tier might be sufficient.`,
        affectedSubscriptionIds: [sub.id],
        potentialSavings: Number(sub.cost) * 0.5,
      })
    }
  }

  return results
}

function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cost)
}

export async function saveOverlapAlerts(userId: string, overlaps: OverlapResult[]): Promise<void> {
  // Remove non-dismissed alerts and recreate fresh ones
  await prisma.overlapAlert.deleteMany({
    where: { userId, dismissed: false },
  })

  if (overlaps.length === 0) return

  await prisma.overlapAlert.createMany({
    data: overlaps.map((o) => ({
      userId,
      type: o.type,
      description: o.description,
      affectedSubscriptionIds: o.affectedSubscriptionIds,
      potentialSavings: o.potentialSavings,
    })),
  })
}
