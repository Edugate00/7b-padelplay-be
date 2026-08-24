
interface RateLimitInfo {
  messageCount: number;
  windowStart: number;
  lastMessageTime: number;
  violations: number;
}

export interface RateLimitConfig {
  maxMessagesPerWindow: number;
  windowMs: number;
  minIntervalMs: number;
  maxViolations: number;
}

export class RateLimiter {
  private limits = new Map<WebSocket, RateLimitInfo>();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxMessagesPerWindow: config.maxMessagesPerWindow || 50,
      windowMs: config.windowMs || 10_000, // 10 seconds
      minIntervalMs: config.minIntervalMs || 50, // 50ms minimum between messages
      maxViolations: config.maxViolations || 5,
    };
  }

  /**
   * Check if message should be allowed
   */
  checkLimit(
    ws: WebSocket,
    clientId: string = "unknown",
  ): {
    allowed: boolean;
    reason?: string;
  } {
    const now = Date.now();
    let limitInfo = this.limits.get(ws);

    if (!limitInfo) {
      limitInfo = {
        messageCount: 0,
        windowStart: now,
        lastMessageTime: 0,
        violations: 0,
      };
      this.limits.set(ws, limitInfo);
    }

    // Reset window if expired
    if (now - limitInfo.windowStart > this.config.windowMs) {
      limitInfo.messageCount = 0;
      limitInfo.windowStart = now;
      limitInfo.violations = 0;
    }

    // Check interval between messages (anti rapid-fire)
    if (
      limitInfo.lastMessageTime > 0 &&
      now - limitInfo.lastMessageTime < this.config.minIntervalMs
    ) {
      limitInfo.violations++;

     
      if (limitInfo.violations >= this.config.maxViolations) {
        return {
          allowed: false,
          reason: "Too many rate limit violations. Connection will be closed.",
        };
      }

      return {
        allowed: false,
        reason: `Messages too fast. Minimum interval: ${this.config.minIntervalMs}ms`,
      };
    }

    // Check total messages in window
    if (limitInfo.messageCount >= this.config.maxMessagesPerWindow) {

      return {
        allowed: false,
        reason: `Rate limit exceeded. Maximum ${this.config.maxMessagesPerWindow} messages per ${this.config.windowMs / 1000} seconds.`,
      };
    }

    // Update tracking
    limitInfo.messageCount++;
    limitInfo.lastMessageTime = now;

    return { allowed: true };
  }

  /**
   * Clean up rate limit info for disconnected client
   */
  cleanup(ws: WebSocket): void {
    this.limits.delete(ws);
  }

  /**
   * Get current rate limit stats
   */
  getStats(ws: WebSocket): RateLimitInfo | null {
    return this.limits.get(ws) || null;
  }

  /**
   * Reset rate limit for a client
   */
  reset(ws: WebSocket): void {
    this.limits.delete(ws);
  }
}

// Create different rate limiters for different endpoints
export const scoreboardRateLimiter = new RateLimiter({
  maxMessagesPerWindow: 30,
  windowMs: 10_000,
  minIntervalMs: 100,
  maxViolations: 3,
});

export const controllerRateLimiter = new RateLimiter({
  maxMessagesPerWindow: 100, // Controllers need more quota
  windowMs: 10_000,
  minIntervalMs: 50,
  maxViolations: 5,
});

export const displayRateLimiter = new RateLimiter({
  maxMessagesPerWindow: 20, // Displays send fewer messages
  windowMs: 10_000,
  minIntervalMs: 200,
  maxViolations: 3,
});
