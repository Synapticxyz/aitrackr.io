import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { handleCorsOptions, withCors } from '@/lib/cors'
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

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request) ?? new NextResponse(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const corsOpts = handleCorsOptions(request)
  if (corsOpts) return corsOpts
  const origin = request.headers.get('origin')

  // Extension verification: validate via X-API-Key header
  const apiKeyHeader = request.headers.get('X-API-Key')
  if (apiKeyHeader) {
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKeyHeader, deletedAt: null },
      select: { id: true },
    })
    if (!user) return withCors(errors.unauthorized(), origin)
    return withCors(NextResponse.json({ valid: true }), origin)
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
