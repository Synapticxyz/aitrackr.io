#!/usr/bin/env npx tsx
/**
 * Run once to create the AiTrackr Pro product + prices in Stripe.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe.ts
 *
 * Or with .env loaded:
 *   npx dotenv -e .env -- npx tsx scripts/setup-stripe.ts
 *
 * Copy the printed price IDs into your .env file.
 */

import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY
if (!secretKey || secretKey.startsWith('sk_test_placeholder')) {
  console.error('❌  Set a real STRIPE_SECRET_KEY before running this script.')
  process.exit(1)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(secretKey, { apiVersion: '2025-01-27.acacia' as any })

async function main() {
  console.log('🔧  Creating AiTrackr Pro product on Stripe…\n')

  // 1. Product
  const product = await stripe.products.create({
    name: 'AiTrackr Pro',
    description: 'Unlimited AI subscription tracking with Chrome extension and Overlap Engine.',
    metadata: { app: 'aitrackr' },
    images: ['https://aitrackr.io/og.png'],
  })
  console.log(`✅  Product created: ${product.id}  (${product.name})`)

  // 2. Monthly price — $8 / month
  const monthly = await stripe.prices.create({
    product: product.id,
    unit_amount: 800,       // cents
    currency: 'usd',
    recurring: { interval: 'month' },
    nickname: 'Pro Monthly',
    metadata: { plan: 'pro_monthly' },
  })
  console.log(`✅  Monthly price: ${monthly.id}  ($8.00 / month)`)

  // 3. Yearly price — $79 / year
  const yearly = await stripe.prices.create({
    product: product.id,
    unit_amount: 7900,      // cents
    currency: 'usd',
    recurring: { interval: 'year' },
    nickname: 'Pro Yearly',
    metadata: { plan: 'pro_yearly' },
  })
  console.log(`✅  Yearly price:   ${yearly.id}  ($79.00 / year)`)

  console.log('\n─────────────────────────────────────────────────────')
  console.log('Add these to your .env file:\n')
  console.log(`STRIPE_PRICE_ID_MONTHLY="${monthly.id}"`)
  console.log(`STRIPE_PRICE_ID_YEARLY="${yearly.id}"`)
  console.log('─────────────────────────────────────────────────────\n')
  console.log('Next: set up the webhook in the Stripe dashboard:')
  console.log('  https://dashboard.stripe.com/test/webhooks')
  console.log('  Endpoint URL: https://yourdomain.com/api/stripe/webhook')
  console.log('  Events to listen for:')
  console.log('    • checkout.session.completed')
  console.log('    • customer.subscription.updated')
  console.log('    • customer.subscription.deleted')
  console.log('    • invoice.payment_failed')
}

main().catch((err) => {
  console.error('❌  Error:', err.message)
  process.exit(1)
})
