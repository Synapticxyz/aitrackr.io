import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { profileUpdateSchema } from '@/lib/validations'

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed')
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      timezone: parsed.data.timezone,
      emailPreferences: parsed.data.emailPreferences,
    },
    select: { id: true, name: true, timezone: true, emailPreferences: true },
  })

  return NextResponse.json({ user })
}
