import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { createPortalSession } from '@/lib/stripe'

export async function POST() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    return errors.notFound('Stripe customer')
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const portalUrl = await createPortalSession(user.stripeCustomerId, `${appUrl}/dashboard/settings`)

  return NextResponse.json({ url: portalUrl })
}
