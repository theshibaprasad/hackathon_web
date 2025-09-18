import { NextRequest, NextResponse } from 'next/server';
import { securityMonitor } from '@/lib/securityMonitor';
import { rateLimiter } from '@/lib/rateLimiter';

export async function GET(request: NextRequest) {
  try {
    // In production, add proper admin authentication here
    const stats = securityMonitor.getStats();
    
    return NextResponse.json({
      success: true,
      security: {
        stats,
        rateLimiter: {
          // Note: In production, you'd want to get this from Redis or similar
          activeLimits: 'In-memory rate limiter active'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ip } = await request.json();
    
    if (action === 'get_ip_events' && ip) {
      const events = securityMonitor.getEventsForIP(ip);
      return NextResponse.json({
        success: true,
        events,
        ip
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Security action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform security action' },
      { status: 500 }
    );
  }
}

