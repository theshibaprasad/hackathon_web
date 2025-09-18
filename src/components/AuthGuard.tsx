"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token immediately on mount
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    
    if (!token) {
      // No token found, redirect immediately
      window.location.href = '/login';
      return;
    }

    // Token exists, verify it with API
    fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
        setShouldRender(true);
      } else {
        window.location.href = '/login';
      }
    })
    .catch(error => {
      console.error('Auth check error:', error);
      window.location.href = '/login';
    });
  }, []);

  // Don't render anything until we know the auth status
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
