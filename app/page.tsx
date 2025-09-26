"use client";

import { Suspense, lazy } from "react";
import { CompanyHeader } from "@/components/CompanyHeader"
import { CompanyHero } from "@/components/CompanyHero"
import PerformanceMonitor from "@/components/PerformanceMonitor"

// Lazy load non-critical components
const CompanyStatsSection = lazy(() => import("@/components/CompanyStatsSection").then(module => ({ default: module.CompanyStatsSection })))
const CompanyHackathonSection = lazy(() => import("@/components/CompanyHackathonSection").then(module => ({ default: module.CompanyHackathonSection })))
const CompanyTestimonialSection = lazy(() => import("@/components/CompanyTestimonialSection").then(module => ({ default: module.CompanyTestimonialSection })))
const CompanyValuesSection = lazy(() => import("@/components/CompanyValuesSection").then(module => ({ default: module.CompanyValuesSection })))
const CompanyCommunitySection = lazy(() => import("@/components/CompanyCommunitySection").then(module => ({ default: module.CompanyCommunitySection })))
const CompanyCompanySection = lazy(() => import("@/components/CompanyCompanySection").then(module => ({ default: module.CompanyCompanySection })))
const FAQSection = lazy(() => import("@/components/FAQSection").then(module => ({ default: module.FAQSection })))
const CompanyFooter = lazy(() => import("@/components/CompanyFooter").then(module => ({ default: module.CompanyFooter })))

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <PerformanceMonitor />
      
      {/* Simple, clean background that doesn't interfere with content */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/40 via-white/60 to-gray-100/50" />
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-50/30 via-transparent to-zinc-50/40" />
      
      {/* Very subtle orbs only for glass effect contrast */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-gray-200/15 to-gray-300/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-32 w-[300px] h-[300px] bg-gradient-to-br from-slate-200/12 to-zinc-300/8 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-neutral-200/10 to-gray-300/6 rounded-full blur-3xl" />
      </div>
      
      <CompanyHeader />
      
      <CompanyHero />
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyStatsSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyHackathonSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyTestimonialSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyValuesSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyCommunitySection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyCompanySection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyFooter />
      </Suspense>
    </div>
  )
}