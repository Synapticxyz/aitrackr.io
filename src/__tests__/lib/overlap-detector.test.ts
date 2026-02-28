import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    subscription: { findMany: vi.fn() },
    usageLog: { findMany: vi.fn() },
    overlapAlert: { deleteMany: vi.fn(), createMany: vi.fn() },
  },
}))

import { detectOverlaps } from '@/lib/overlap-detector'
import { prisma } from '@/lib/prisma'

const mockSubscriptions = [
  {
    id: 'sub-1', userId: 'user-1', name: 'ChatGPT Plus', provider: 'OpenAI',
    cost: 20, features: ['chat', 'image-gen', 'code'], isActive: true, isDeleted: false,
    billingCycle: 'MONTHLY', nextBillingDate: new Date(), category: 'TEXT_GEN',
    createdAt: new Date(), updatedAt: new Date(), url: null, notes: null,
  },
  {
    id: 'sub-2', userId: 'user-1', name: 'Claude Pro', provider: 'Anthropic',
    cost: 20, features: ['chat', 'code'], isActive: true, isDeleted: false,
    billingCycle: 'MONTHLY', nextBillingDate: new Date(), category: 'TEXT_GEN',
    createdAt: new Date(), updatedAt: new Date(), url: null, notes: null,
  },
  {
    id: 'sub-3', userId: 'user-1', name: 'Midjourney', provider: 'Midjourney',
    cost: 30, features: ['image-gen'], isActive: true, isDeleted: false,
    billingCycle: 'MONTHLY', nextBillingDate: new Date(), category: 'IMAGE_GEN',
    createdAt: new Date(), updatedAt: new Date(), url: null, notes: null,
  },
]

describe('Overlap Detector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ currency: 'EUR' } as never)
  })

  it('detects duplicate capabilities', async () => {
    vi.mocked(prisma.subscription.findMany).mockResolvedValue(mockSubscriptions as never)
    vi.mocked(prisma.usageLog.findMany).mockResolvedValue([])

    const results = await detectOverlaps('user-1')
    const duplicates = results.filter((r) => r.type === 'DUPLICATE_CAPABILITY')
    expect(duplicates.length).toBeGreaterThan(0)
  })

  it('detects unused subscriptions', async () => {
    vi.mocked(prisma.subscription.findMany).mockResolvedValue(mockSubscriptions as never)
    vi.mocked(prisma.usageLog.findMany).mockResolvedValue([]) // No usage

    const results = await detectOverlaps('user-1')
    const unused = results.filter((r) => r.type === 'UNUSED_SUBSCRIPTION')
    expect(unused.length).toBeGreaterThan(0)
  })

  it('calculates potential savings', async () => {
    vi.mocked(prisma.subscription.findMany).mockResolvedValue(mockSubscriptions as never)
    vi.mocked(prisma.usageLog.findMany).mockResolvedValue([])

    const results = await detectOverlaps('user-1')
    const withSavings = results.filter((r) => r.potentialSavings > 0)
    expect(withSavings.length).toBeGreaterThan(0)
  })

  it('returns empty array for user with no subscriptions', async () => {
    vi.mocked(prisma.subscription.findMany).mockResolvedValue([])
    vi.mocked(prisma.usageLog.findMany).mockResolvedValue([])

    const results = await detectOverlaps('user-empty')
    expect(results).toEqual([])
  })
})
