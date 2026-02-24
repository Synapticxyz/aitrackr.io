import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'
import { errors } from '@/lib/api-error'
import { createCustomer } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'
import { authRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const rateLimit = authRateLimit(ip)
  if (!rateLimit.success) return errors.rateLimited(rateLimit.reset)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = signUpSchema.safeParse(body)
  if (!parsed.success) {
    return errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed')
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: 'Email already in use', code: 'CONFLICT', status: 409 },
      { status: 409 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  })

  // Create Stripe customer
  try {
    const customerId = await createCustomer(email, name)
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  } catch (err) {
    console.error('[Signup] Failed to create Stripe customer:', err)
  }

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email, name).catch(console.error)

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
}
