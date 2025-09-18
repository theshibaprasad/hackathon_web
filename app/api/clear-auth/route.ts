import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response that clears all authentication cookies
    const response = NextResponse.json({
      message: 'Authentication data cleared successfully',
      cleared: [
        'auth-token',
        'session-token',
        'user-token',
        'jwt-token',
        'clerk-session-token',
        'clerk-db-jwt',
        '__session',
        '__clerk_db_jwt',
        '__clerk_session_token'
      ]
    });

    // Clear all possible authentication cookies
    const cookiesToClear = [
      'auth-token',
      'session-token', 
      'user-token',
      'jwt-token',
      'clerk-session-token',
      'clerk-db-jwt',
      '__session',
      '__clerk_db_jwt',
      '__clerk_session_token',
      'clerk-session',
      'clerk-db-jwt',
      'clerk-session-token',
      '__clerk_session',
      '__clerk_db_jwt',
      '__clerk_session_token',
      'clerk-session-token',
      'clerk-db-jwt',
      'clerk-session',
      '__clerk_session',
      '__clerk_db_jwt',
      '__clerk_session_token'
    ];

    // Set each cookie to expire immediately with multiple combinations
    cookiesToClear.forEach(cookieName => {
      // Clear with current domain
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        domain: request.nextUrl.hostname,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });

      // Clear with subdomain
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        domain: `.${request.nextUrl.hostname}`,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });

      // Clear without domain (for localhost)
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });

      // Clear with different paths
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/dashboard',
        domain: request.nextUrl.hostname,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });
    });

    return response;

  } catch (error) {
    console.error('Error clearing authentication data:', error);
    return NextResponse.json(
      { 
        message: 'Error clearing authentication data', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return information about what cookies are currently present
  const cookies = request.cookies.getAll();
  const authCookies = cookies.filter(cookie => 
    cookie.name.includes('auth') || 
    cookie.name.includes('token') || 
    cookie.name.includes('session') ||
    cookie.name.includes('clerk')
  );

  return NextResponse.json({
    message: 'Current authentication cookies',
    cookies: authCookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value.substring(0, 20) + '...', // Truncate for security
      hasValue: !!cookie.value
    })),
    totalCookies: cookies.length,
    authCookiesCount: authCookies.length
  });
}
