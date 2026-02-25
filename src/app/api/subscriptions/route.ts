import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { subscriptionSchema, subscriptionUpdateSchema } from '@/lib/validations'
import { errors } from '@/lib/api-error'
import { generalRateLimit } from '@/lib/rate-limit'
import { revalidateTag } from 'next/cache'

const FREE_PLAN_LIMIT = 3

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id, isDeleted: false },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ subscriptions })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const rateLimit = generalRateLimit(session.user.id)
  if (!rateLimit.success) return errors.rateLimited(rateLimit.reset)

  // Enforce free plan limit
  if (session.user.subscriptionStatus === 'FREE') {
    const count = await prisma.subscription.count({
      where: { userId: session.user.id, isDeleted: false },
    })
    if (count >= FREE_PLAN_LIMIT) return errors.subscriptionLimit()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = subscriptionSchema.safeParse(body)
  if (!parsed.success) {
    return errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed')
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      nextBillingDate: new Date(parsed.data.nextBillingDate),
    },
  })

  revalidateTag(`overlaps:${session.user.id}`)
  return NextResponse.json({ subscription }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = subscriptionUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed')
  }

  const { id, ...data } = parsed.data

  const existing = await prisma.subscription.findFirst({
    where: { id, userId: session.user.id, isDeleted: false },
  })
  if (!existing) return errors.notFound('Subscription')

  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      ...data,
      nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : undefined,
    },
  })

  revalidateTag(`overlaps:${session.user.id}`)
  return NextResponse.json({ subscription })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return errors.validation('Subscription ID required')

  const existing = await prisma.subscription.findFirst({
    where: { id, userId: session.user.id, isDeleted: false },
  })
  if (!existing) return errors.notFound('Subscription')

  await prisma.subscription.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  })

  revalidateTag(`overlaps:${session.user.id}`)
  return NextResponse.json({ success: true })
}
