import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/privacy',
  '/terms',
  '/cookies',
  '/auth/signin',
  '/auth/signup',
]

const PUBLIC_API_PREFIXES = [
  '/api/auth',
  '/api/health',
  '/api/stripe/webhook',
  '/api/extension/version',
]

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true
  return false
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }
  return response
}

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl
  const session = (req as { auth: { user?: { id: string; isAdmin?: boolean } } | null }).auth

  // Always add security headers
  const response = NextResponse.next()
  addSecurityHeaders(response)

  // Allow public routes without auth
  if (isPublicRoute(pathname)) return response

  // Extension usage route uses API key auth, not session — handled in the route itself
  if (pathname === '/api/usage' || pathname.startsWith('/api/usage/')) return response

  // Cron routes use secret header auth — handled in the route itself
  if (pathname.startsWith('/api/cron/')) return response

  // Require session for protected routes
  if (!session?.user) {
    if (pathname.startsWith('/api/')) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Authentication required', code: 'UNAUTHORIZED', status: 401 }, { status: 401 })
      )
    }
    const url = req.nextUrl.clone()
    url.pathname = '/auth/signin'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Admin routes require isAdmin flag
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!session.user.isAdmin) {
      if (pathname.startsWith('/api/')) {
        return addSecurityHeaders(
          NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN', status: 403 }, { status: 403 })
        )
      }
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
