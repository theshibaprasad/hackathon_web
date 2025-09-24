// Security monitoring and fraud detection

interface SecurityEvent {
  type: 'failed_otp' | 'rate_limit' | 'suspicious_activity';
  ip: string;
  email?: string;
  timestamp: number;
  details: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000; // Keep last 1000 events

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

  }

  // Check for suspicious patterns
  isSuspiciousActivity(ip: string, email?: string): boolean {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Count failed OTP attempts in last hour
    const failedAttempts = this.events.filter(event => 
      event.type === 'failed_otp' && 
      event.ip === ip && 
      event.timestamp > oneHourAgo
    ).length;

    // Count rate limit hits in last hour
    const rateLimitHits = this.events.filter(event => 
      event.type === 'rate_limit' && 
      event.ip === ip && 
      event.timestamp > oneHourAgo
    ).length;

    // Check for multiple email attempts
    const emailAttempts = email ? this.events.filter(event => 
      event.email === email && 
      event.timestamp > oneHourAgo
    ).length : 0;

    // Flag as suspicious if:
    // - More than 10 failed OTP attempts
    // - More than 5 rate limit hits
    // - More than 20 total attempts for same email
    return failedAttempts > 10 || rateLimitHits > 5 || emailAttempts > 20;
  }

  // Get security statistics
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(event => event.timestamp > oneHourAgo);
    const dailyEvents = this.events.filter(event => event.timestamp > oneDayAgo);

    return {
      recent: {
        total: recentEvents.length,
        failedOTP: recentEvents.filter(e => e.type === 'failed_otp').length,
        rateLimit: recentEvents.filter(e => e.type === 'rate_limit').length,
        suspicious: recentEvents.filter(e => e.type === 'suspicious_activity').length
      },
      daily: {
        total: dailyEvents.length,
        failedOTP: dailyEvents.filter(e => e.type === 'failed_otp').length,
        rateLimit: dailyEvents.filter(e => e.type === 'rate_limit').length,
        suspicious: dailyEvents.filter(e => e.type === 'suspicious_activity').length
      }
    };
  }

  // Get events for specific IP
  getEventsForIP(ip: string, hours: number = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.events.filter(event => 
      event.ip === ip && event.timestamp > cutoff
    );
  }

  // Clean up old events
  cleanup() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
  }
}

export const securityMonitor = new SecurityMonitor();

// Cleanup old events daily
setInterval(() => {
  securityMonitor.cleanup();
}, 24 * 60 * 60 * 1000);

