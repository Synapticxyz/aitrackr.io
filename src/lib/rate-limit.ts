interface TokenBucket {
  tokens: number
  lastRefill: number
}

interface RateLimitConfig {
  maxTokens: number
  refillRate: number  // tokens per ms
  windowMs: number
}

const buckets = new Map<string, TokenBucket>()

// Cleanup old buckets every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of Array.from(buckets.entries())) {
    if (now - bucket.lastRefill > 3600000) {
      buckets.delete(key)
    }
  }
}, 600000)

function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket) {
    bucket = { tokens: config.maxTokens, lastRefill: now }
    buckets.set(key, bucket)
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill
  const refillAmount = elapsed * config.refillRate
  bucket.tokens = Math.min(config.maxTokens, bucket.tokens + refillAmount)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    const resetMs = Math.ceil((1 - bucket.tokens) / config.refillRate)
    return { success: true, remaining: Math.floor(bucket.tokens), reset: resetMs }
  }

  const resetMs = Math.ceil((1 - bucket.tokens) / config.refillRate)
  return { success: false, remaining: 0, reset: resetMs }
}

// 5 attempts per minute per IP (for auth routes)
export function authRateLimit(ip: string) {
  return checkRateLimit(`auth:${ip}`, {
    maxTokens: 5,
    refillRate: 5 / 60000,
    windowMs: 60000,
  })
}

// 100 requests per hour per API key (for extension usage ingestion)
export function usageRateLimit(apiKey: string) {
  return checkRateLimit(`usage:${apiKey}`, {
    maxTokens: 100,
    refillRate: 100 / 3600000,
    windowMs: 3600000,
  })
}

// 1000 requests per hour per user (general API)
export function generalRateLimit(userId: string) {
  return checkRateLimit(`general:${userId}`, {
    maxTokens: 1000,
    refillRate: 1000 / 3600000,
    windowMs: 3600000,
  })
}
