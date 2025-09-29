"use client";

import { Suspense, lazy, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';
import { Skeleton, CardSkeleton, SectionSkeleton, HeroSkeleton, PageSkeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  type?: 'card' | 'section' | 'hero' | 'page' | 'custom';
}

// Pre-defined fallback components for different use cases
const fallbackComponents = {
  card: <CardSkeleton />,
  section: <SectionSkeleton />,
  hero: <HeroSkeleton />,
  page: <PageSkeleton />,
  custom: <Skeleton className="h-32 w-full" />
};

export function LazyWrapper({ 
  children, 
  fallback, 
  type = 'custom' 
}: LazyWrapperProps) {
  const fallbackComponent = fallback || fallbackComponents[type];
  
  return (
    <Suspense fallback={fallbackComponent}>
      {children}
    </Suspense>
  );
}

// Higher-order component for lazy loading
// Note: A previous version exported a generic withLazyLoading HOC using
// a dynamic template import (import(`@/components/${Component.name}`)).
// That created a Webpack context import that inadvertently pulled
// server-only components into the client bundle (e.g., ones using next/headers),
// causing build errors. We intentionally removed that helper.

// Hook for intersection observer lazy loading
export function useLazyLoading(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
}

// Lazy image component with skeleton
export function LazyImage({ 
  src, 
  alt, 
  className = "",
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
}

// Lazy component with intersection observer
export function LazyComponent({ 
  children, 
  fallback,
  type = 'custom',
  threshold = 0.1 
}: {
  children: ReactNode;
  fallback?: ReactNode;
  type?: 'card' | 'section' | 'hero' | 'page' | 'custom';
  threshold?: number;
}) {
  const { ref, isVisible } = useLazyLoading(threshold);
  const fallbackComponent = fallback || fallbackComponents[type];

  return (
    <div ref={ref}>
      {isVisible ? children : fallbackComponent}
    </div>
  );
}
