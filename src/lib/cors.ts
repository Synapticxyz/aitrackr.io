import { NextRequest, NextResponse } from 'next/server'

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID

function getAllowedOrigins(): string[] {
  const origins = [
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ]
  if (EXTENSION_ID) {
    origins.push(`chrome-extension://${EXTENSION_ID}`)
  }
  // Allow any chrome extension origin in development
  return origins
}

export function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigins = getAllowedOrigins()
  const isChromExtension = origin?.startsWith('chrome-extension://')
  const isAllowed = origin && (allowedOrigins.includes(origin) || isChromExtension)

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : (allowedOrigins[0] ?? ''),
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-API-Key, X-Extension-Version, Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleCorsOptions(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin')
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin),
    })
  }
  return null
}

export function withCors(response: NextResponse, origin: string | null): NextResponse {
  const headers = corsHeaders(origin)
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
