import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/onboarding',
  '/test-middleware'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define routes that should be excluded from protection
  const excludedRoutes = [
    '/admin/login',
    '/admin/dashboard',
    '/admin',
    '/login',
    '/register'
  ];
  
  // Check if the current path is excluded
  const isExcludedRoute = excludedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's an excluded route, allow access without authentication
  if (isExcludedRoute) {
    return NextResponse.next();
  }
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Basic token validation (JWT has 3 parts separated by dots)
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Check if token is not expired (basic check)
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        throw new Error('Token expired');
      }

      // Special handling for onboarding route only
      if (pathname.startsWith('/onboarding')) {
        // Allow access to onboarding - OnboardingGuard will handle the database check
        return NextResponse.next();
      }

      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding',
    '/onboarding/:path*',
    '/test-middleware/:path*',
    '/test-onboarding-status/:path*',
    '/((?!admin|login|register|api).*)'
  ],
};