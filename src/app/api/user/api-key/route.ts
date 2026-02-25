import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { v4 as uuidv4 } from 'uuid'

export async function POST() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const newApiKey = `atk_${uuidv4().replace(/-/g, '')}`

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      apiKey: newApiKey,
      apiKeyCreatedAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'REGENERATE_API_KEY',
      metadata: { createdAt: new Date().toISOString() },
    },
  })

  return NextResponse.json({ apiKey: newApiKey })
}

export async function GET(request: Request) {
  // Extension verification: validate via X-API-Key header
  const apiKeyHeader = request.headers.get('X-API-Key')
  if (apiKeyHeader) {
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKeyHeader, deletedAt: null },
      select: { id: true },
    })
    if (!user) return errors.unauthorized()
    return NextResponse.json({ valid: true })
  }

  // Dashboard: validate via session
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true, apiKeyCreatedAt: true },
  })

  if (!user) return errors.notFound('User')

  return NextResponse.json({
    hasApiKey: !!user.apiKey,
    apiKeyCreatedAt: user.apiKeyCreatedAt,
    maskedKey: user.apiKey ? `atk_****${user.apiKey.slice(-8)}` : null,
  })
}
