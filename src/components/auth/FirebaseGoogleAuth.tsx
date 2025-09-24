'use client';

import { useState, useEffect, useRef } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FirebaseGoogleAuthProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function FirebaseGoogleAuth({
  onSuccess,
  onError,
  children,
  className,
  variant = 'outline',
  size = 'default'
}: FirebaseGoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isSigningInRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      setIsLoading(false);
      isSigningInRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Function to reset all states and abort ongoing operations
  const resetAuthState = () => {
    setIsLoading(false);
    isSigningInRef.current = false;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleGoogleSignIn = async () => {
    // Always reset everything first - fresh start every time
    resetAuthState();
    
    // Small delay to ensure state is properly reset
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      setIsLoading(true);
      isSigningInRef.current = true;
      
      // Create abort controller for the request
      abortControllerRef.current = new AbortController();
      
      // Set up a longer timeout (3 minutes) only as a safety net
      timeoutRef.current = setTimeout(() => {
        resetAuthState();
      }, 180000); // 3 minutes
      
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      
      // Clear timeout since sign-in was successful
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the ID token to your backend
      const response = await fetch('/api/auth/firebase-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (data.success) {
        // Clear timeout and reset state
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        resetAuthState();
        
        toast({
          title: data.isNewUser ? "Account created successfully!" : "Login successful!",
          description: data.isNewUser 
            ? "Welcome to Novothon! Please complete your profile."
            : "Welcome back!",
        });
        
        if (onSuccess) {
          onSuccess(data.user);
        }
        
        // Redirect based on user status
        if (data.isNewUser) {
          window.location.href = '/onboarding';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Handle popup cancellation gracefully - immediately reset button
      if (error.code === 'auth/popup-closed-by-user' || 
          error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/user-cancelled') {
        resetAuthState();
        // User cancelled - this is expected behavior, no error message needed
        return;
      }
      
      // For other errors, reset state and show error
      resetAuthState();
      
      // Handle other errors
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`w-full ${className || ''}`}
      type="button"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        children || (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )
      )}
    </Button>
  );
}
