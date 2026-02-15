/**
 * Simple in-memory rate limiting
 * For production, use Redis or similar
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 10,
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Create new record
    const resetAt = now + config.interval;
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(identifier, record);

  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

// Cleanup old records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export const RATE_LIMITS = {
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts
  },
  API: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  AUTOSAVE: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 autosaves per minute
  },
};
