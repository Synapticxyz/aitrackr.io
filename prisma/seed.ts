import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { subDays, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('Test1234!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@aitrackr.io' },
    update: {},
    create: {
      email: 'demo@aitrackr.io',
      name: 'Demo User',
      hashedPassword,
      subscriptionStatus: 'PRO',
      timezone: 'Europe/Ljubljana',
    },
  })
  console.log(`Created user: ${user.email}`)

  // Create subscriptions
  const subs = await Promise.all([
    prisma.subscription.upsert({
      where: { id: 'seed-sub-1' },
      update: {},
      create: {
        id: 'seed-sub-1',
        userId: user.id,
        name: 'ChatGPT Plus',
        provider: 'OpenAI',
        cost: 20,
        billingCycle: 'MONTHLY',
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        category: 'TEXT_GEN',
        features: ['chat', 'image-gen', 'code', 'browse'],
        url: 'https://chat.openai.com',
      },
    }),
    prisma.subscription.upsert({
      where: { id: 'seed-sub-2' },
      update: {},
      create: {
        id: 'seed-sub-2',
        userId: user.id,
        name: 'Claude Pro',
        provider: 'Anthropic',
        cost: 20,
        billingCycle: 'MONTHLY',
        nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        category: 'TEXT_GEN',
        features: ['chat', 'code', 'research'],
        url: 'https://claude.ai',
      },
    }),
    prisma.subscription.upsert({
      where: { id: 'seed-sub-3' },
      update: {},
      create: {
        id: 'seed-sub-3',
        userId: user.id,
        name: 'Midjourney Standard',
        provider: 'Midjourney',
        cost: 30,
        billingCycle: 'MONTHLY',
        nextBillingDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        category: 'IMAGE_GEN',
        features: ['image-gen'],
        url: 'https://midjourney.com',
      },
    }),
    prisma.subscription.upsert({
      where: { id: 'seed-sub-4' },
      update: {},
      create: {
        id: 'seed-sub-4',
        userId: user.id,
        name: 'Perplexity Pro',
        provider: 'Perplexity',
        cost: 20,
        billingCycle: 'MONTHLY',
        nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        category: 'RESEARCH',
        features: ['research', 'browse', 'chat'],
        url: 'https://perplexity.ai',
      },
    }),
  ])
  console.log(`Created ${subs.length} subscriptions`)

  // Create 30 days of usage logs
  const tools = [
    { tool: 'ChatGPT', feature: 'chat', sessionBase: 'chatgpt' },
    { tool: 'Claude', feature: 'code', sessionBase: 'claude' },
  ]

  const logs = []
  for (let day = 0; day < 30; day++) {
    const date = startOfDay(subDays(new Date(), day))

    for (const t of tools) {
      // Skip some days for realism
      if (Math.random() < 0.2) continue

      const sessions = Math.floor(Math.random() * 3) + 1
      for (let s = 0; s < sessions; s++) {
        logs.push({
          userId: user.id,
          tool: t.tool,
          feature: t.feature,
          durationSeconds: Math.floor(Math.random() * 3600) + 300,
          sessionId: `${t.sessionBase}-${day}-${s}`,
          date,
        })
      }
    }
  }

  await prisma.usageLog.createMany({ data: logs, skipDuplicates: true })
  console.log(`Created ${logs.length} usage log entries`)

  // Create overlap alerts
  await prisma.overlapAlert.createMany({
    data: [
      {
        userId: user.id,
        type: 'DUPLICATE_CAPABILITY',
        description: 'ChatGPT Plus and Claude Pro both include "chat" capability. Consider keeping only one to save $20/month.',
        affectedSubscriptionIds: ['seed-sub-1', 'seed-sub-2'],
        potentialSavings: 20,
      },
      {
        userId: user.id,
        type: 'UNUSED_SUBSCRIPTION',
        description: "Midjourney Standard hasn't been used in the last 14 days. You could save $30/month by cancelling it.",
        affectedSubscriptionIds: ['seed-sub-3'],
        potentialSavings: 30,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seeding complete!')
  console.log('  Login: demo@aitrackr.io / Test1234!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
