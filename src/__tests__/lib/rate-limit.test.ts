import { describe, it, expect, beforeEach } from 'vitest'
import { authRateLimit, usageRateLimit, generalRateLimit } from '@/lib/rate-limit'

describe('Rate Limiter', () => {
  it('allows requests within limit', () => {
    const result = authRateLimit('test-ip-1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })

  it('blocks requests exceeding auth limit', () => {
    const ip = 'test-ip-block-' + Date.now()
    const results = []
    for (let i = 0; i < 6; i++) {
      results.push(authRateLimit(ip))
    }
    const blocked = results.filter((r) => !r.success)
    expect(blocked.length).toBeGreaterThanOrEqual(1)
  })

  it('returns reset time when blocked', () => {
    const ip = 'test-ip-reset-' + Date.now()
    for (let i = 0; i < 6; i++) authRateLimit(ip)
    const result = authRateLimit(ip)
    if (!result.success) {
      expect(result.reset).toBeGreaterThan(0)
    }
  })

  it('allows usage rate limit requests', () => {
    const result = usageRateLimit('test-key-1')
    expect(result.success).toBe(true)
  })

  it('allows general rate limit requests', () => {
    const result = generalRateLimit('user-id-1')
    expect(result.success).toBe(true)
  })
})
