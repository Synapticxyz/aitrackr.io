import { NextResponse } from 'next/server'

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'SUBSCRIPTION_LIMIT'
  | 'INVALID_API_KEY'

export function apiError(message: string, code: ErrorCode, status: number) {
  return NextResponse.json({ error: message, code, status }, { status })
}

export const errors = {
  unauthorized: () => apiError('Authentication required', 'UNAUTHORIZED', 401),
  forbidden: () => apiError('Access denied', 'FORBIDDEN', 403),
  rateLimited: (resetIn?: number) =>
    NextResponse.json(
      { error: 'Too many requests', code: 'RATE_LIMITED', status: 429 },
      {
        status: 429,
        headers: resetIn ? { 'Retry-After': String(resetIn) } : {},
      }
    ),
  notFound: (resource = 'Resource') =>
    apiError(`${resource} not found`, 'NOT_FOUND', 404),
  validation: (message: string) =>
    apiError(message, 'VALIDATION_ERROR', 400),
  internal: (message = 'Internal server error') =>
    apiError(message, 'INTERNAL_ERROR', 500),
  subscriptionLimit: () =>
    apiError(
      'Free plan is limited to 3 subscriptions. Upgrade to Pro for unlimited.',
      'SUBSCRIPTION_LIMIT',
      403
    ),
  invalidApiKey: () =>
    apiError('Invalid or missing API key', 'INVALID_API_KEY', 401),
}
