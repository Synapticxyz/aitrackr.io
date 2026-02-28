import { readFileSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { handleCorsOptions, withCors } from '@/lib/cors'

const CHANGELOG: { version: string; date: string; notes: string[] }[] = [
  {
    version: '1.0.2',
    date: '2026-02-27',
    notes: ['Default API base set to localhost:3002 for dev', 'Dashboard link to latest extension zip'],
  },
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

function getExtensionVersionFromManifest(): string {
  // Prefer version.json written by pack script (public/extension/version.json)
  for (const p of [
    join(process.cwd(), 'public', 'extension', 'version.json'),
    join(process.cwd(), 'extension', 'manifest.json'),
  ]) {
    try {
      const raw = readFileSync(p, 'utf8')
      const data = JSON.parse(raw) as { version?: string }
      if (data.version) return data.version
    } catch {
      continue
    }
  }
  return process.env.EXTENSION_VERSION ?? '1.0.0'
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request) ?? new NextResponse(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const corsOpts = handleCorsOptions(request)
  if (corsOpts) return corsOpts
  const origin = request.headers.get('origin')

  const latestVersion = getExtensionVersionFromManifest()
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
