"use client";

import { useEffect } from 'react';

// Type definitions for performance entries
interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number;
}

interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number;
  hadRecentInput?: boolean;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          // Track LCP
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          // Track FID
          const fidEntry = entry as PerformanceEntryWithProcessingStart;
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - entry.startTime);
          }
        }
        if (entry.entryType === 'layout-shift') {
          // Track CLS
          const clsEntry = entry as PerformanceEntryWithValue;
          if (!clsEntry.hadRecentInput && clsEntry.value) {
            console.log('CLS:', clsEntry.value);
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Performance Observer not supported
    }

    // Monitor page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart);
        console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
