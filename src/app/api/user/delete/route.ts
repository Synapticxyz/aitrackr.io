import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { cancelSubscription } from '@/lib/stripe'
import { sendAccountDeletedEmail } from '@/lib/email'

export async function POST() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      stripeSubscriptionId: true,
      deletedAt: true,
    },
  })

  if (!user) return errors.notFound('User')
  if (user.deletedAt) {
    return NextResponse.json({ message: 'Account already scheduled for deletion' })
  }

  // Cancel Stripe subscription if active
  if (user.stripeSubscriptionId) {
    try {
      await cancelSubscription(user.stripeSubscriptionId)
    } catch (err) {
      console.error('[Delete] Failed to cancel Stripe subscription:', err)
    }
  }

  // Soft delete the user
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      deletedAt: new Date(),
      subscriptionStatus: 'CANCELLED',
      apiKey: null,
    },
  })

  // Log to audit trail
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE_ACCOUNT',
      metadata: {
        requestedAt: new Date().toISOString(),
        scheduledHardDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  })

  // Send confirmation email
  if (user.email) {
    await sendAccountDeletedEmail(user.email, user.name ?? 'there')
  }

  return NextResponse.json({
    success: true,
    message: 'Account scheduled for deletion. Your data will be permanently deleted within 30 days.',
  })
}
