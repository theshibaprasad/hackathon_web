"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBoarding, setIsBoarding] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch('/api/auth/onboarding-status', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setIsBoarding(data.isBoarding);
          
          // If user has already completed onboarding, redirect to dashboard
          if (data.isBoarding) {
            router.push('/dashboard');
            return;
          }
        } else if (response.status === 401) {
          // User not authenticated, redirect to login
          router.push('/login');
          return;
        } else {
          console.error('Failed to check onboarding status');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  // Show loading state while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your onboarding status...</p>
        </motion.div>
      </div>
    );
  }

  // If user has completed onboarding, don't render children (redirect will happen)
  if (isBoarding) {
    return null;
  }

  // If user hasn't completed onboarding, show the onboarding form
  return <>{children}</>;
}
