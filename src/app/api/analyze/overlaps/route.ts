import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { errors } from '@/lib/api-error'
import { detectOverlaps, saveOverlapAlerts } from '@/lib/overlap-detector'
import { unstable_cache, revalidateTag } from 'next/cache'
import { z } from 'zod'

function getCachedOverlaps(userId: string) {
  return unstable_cache(
    () => detectOverlaps(userId),
    [`overlaps-${userId}`],
    { revalidate: 300, tags: [`overlaps:${userId}`] }
  )()
}

export async function GET() {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  const overlaps = await getCachedOverlaps(session.user.id)
  await saveOverlapAlerts(session.user.id, overlaps)

  const alerts = await prisma.overlapAlert.findMany({
    where: { userId: session.user.id, dismissed: false },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ alerts })
}


export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return errors.unauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors.validation('Invalid JSON body')
  }

  const parsed = z.object({ alertId: z.string().cuid() }).safeParse(body)
  if (!parsed.success) return errors.validation('Valid alertId required')

  const alert = await prisma.overlapAlert.findFirst({
    where: { id: parsed.data.alertId, userId: session.user.id },
  })
  if (!alert) return errors.notFound('Alert')

  await prisma.overlapAlert.update({
    where: { id: parsed.data.alertId },
    data: { dismissed: true },
  })

  return NextResponse.json({ success: true })
}
