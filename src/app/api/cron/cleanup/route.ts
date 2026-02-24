import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Find users scheduled for hard delete
  const usersToDelete = await prisma.user.findMany({
    where: {
      deletedAt: { lte: thirtyDaysAgo },
    },
    select: { id: true, email: true },
  })

  let deleted = 0
  for (const user of usersToDelete) {
    try {
      // Cascade deletes handle related records
      await prisma.user.delete({ where: { id: user.id } })
      deleted++
      console.log(`[Cron Cleanup] Hard deleted user: ${user.id}`)
    } catch (err) {
      console.error(`[Cron Cleanup] Failed to delete user ${user.id}:`, err)
    }
  }

  return NextResponse.json({
    success: true,
    processed: usersToDelete.length,
    deleted,
    timestamp: new Date().toISOString(),
  })
}
