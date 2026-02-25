import { NextRequest, NextResponse } from 'next/server'
import { handleCorsOptions, withCors } from '@/lib/cors'

const CHANGELOG: { version: string; date: string; notes: string[] }[] = [
  {
    version: '1.0.0',
    date: '2026-02-25',
    notes: [
      'Initial release',
      'Tracks 18 AI tools including ChatGPT, Claude, Gemini, Kimi and more',
      'Privacy-first: never reads prompts or content',
      'Auto-syncs usage every 5 minutes',
      'Idle detection stops tracking when you step away',
    ],
  },
]

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request) ?? new NextResponse(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const corsOpts = handleCorsOptions(request)
  if (corsOpts) return corsOpts
  const origin = request.headers.get('origin')

  const latestVersion = process.env.EXTENSION_VERSION ?? '1.0.0'
  const minVersion = process.env.EXTENSION_MIN_VERSION ?? '1.0.0'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.xflashdev.com'

  const latest = CHANGELOG[0]

  return withCors(
    NextResponse.json({
      latestVersion,
      minVersion,
      updateUrl: `${appUrl}/dashboard/extension`,
      changelog: CHANGELOG,
      releaseNotes: latest?.notes.join(' · ') ?? '',
    }),
    origin,
  )
}
