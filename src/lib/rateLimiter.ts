// Simple in-memory rate limiter for development
// For production, use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_ATTEMPTS = 5; // 5 attempts per window

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      });
      return true;
    }

    // Reset if window expired
    if (now > entry.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      });
      return true;
    }

    // Check if under limit
    if (entry.count < this.MAX_ATTEMPTS) {
      entry.count++;
      return true;
    }

    return false;
  }

  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return this.MAX_ATTEMPTS;
    
    const now = Date.now();
    if (now > entry.resetTime) return this.MAX_ATTEMPTS;
    
    return Math.max(0, this.MAX_ATTEMPTS - entry.count);
  }

  getResetTime(identifier: string): number | null {
    const entry = this.attempts.get(identifier);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.resetTime) return null;
    
    return entry.resetTime;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
