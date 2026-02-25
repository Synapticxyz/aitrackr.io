import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { z } from 'zod'

const toolSuggestionSchema = z.object({
  url: z.string().min(1, 'URL is required').max(255),
  name: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
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

  const parsed = toolSuggestionSchema.safeParse(body)
  if (!parsed.success) {
    return errors.validation(parsed.error.issues[0]?.message ?? 'Validation failed')
  }

  const suggestion = await prisma.toolSuggestion.create({
    data: {
      userId: session.user.id,
      url: parsed.data.url,
      name: parsed.data.name ?? null,
      notes: parsed.data.notes ?? null,
    },
  })

  return NextResponse.json({ suggestion }, { status: 201 })
}
