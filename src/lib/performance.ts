// Performance optimization utilities

// Debounce function for search and input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
}

// Prefetch resources for better performance
export function prefetchResource(href: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// Image optimization utilities
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height?: number,
  quality: number = 75
) {
  // This would integrate with your image optimization service
  // For Next.js, you can use the built-in Image Optimization API
  return `${src}?w=${width}${height ? `&h=${height}` : ''}&q=${quality}`;
}

// Bundle size optimization
export function loadScript(src: string, async: boolean = true): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// Memory management
export function cleanupEventListeners(
  element: HTMLElement,
  eventType: string,
  handler: EventListener
) {
  element.removeEventListener(eventType, handler);
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
}

// Resource hints for better loading
export function addResourceHints() {
  if (typeof window !== 'undefined') {
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'images.unsplash.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnectOrigins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectOrigins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Critical CSS inlining
export function inlineCriticalCSS(css: string) {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Bundle splitting utilities
export function createChunkName(name: string) {
  return `chunk-${name}`;
}

// Cache management
export function clearCache() {
  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
}

// Performance budget monitoring
export function checkPerformanceBudget() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      fid: 0, // First Input Delay
      cls: 0  // Cumulative Layout Shift
    };

    // Budget thresholds
    const budgets = {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1   // 0.1
    };

    // Check if metrics exceed budget
    Object.keys(budgets).forEach(metric => {
      if (metrics[metric as keyof typeof metrics] > budgets[metric as keyof typeof budgets]) {
        console.warn(`Performance budget exceeded for ${metric}: ${metrics[metric as keyof typeof metrics]} > ${budgets[metric as keyof typeof budgets]}`);
      }
    });
  }
}
