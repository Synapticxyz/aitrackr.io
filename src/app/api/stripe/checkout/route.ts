import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { createCheckoutSession, createCustomer } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  priceId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return errors.validation('Valid priceId required')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  })

  if (!user) return errors.notFound('User')

  // Create Stripe customer if not exists
  if (!user.stripeCustomerId) {
    const customerId = await createCustomer(user.email, user.name)
    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    })
  }

  const checkoutUrl = await createCheckoutSession(
    user.stripeCustomerId!,
    parsed.data.priceId,
    session.user.id,
    `${appUrl}/dashboard?upgraded=true`,
    `${appUrl}/pricing?cancelled=true`
  )

  return NextResponse.json({ url: checkoutUrl })
}
