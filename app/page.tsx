"use client";

import { CompanyHeader } from "@/components/CompanyHeader"
import { CompanyHero } from "@/components/CompanyHero"
import { CompanyStatsSection } from "@/components/CompanyStatsSection"
import { CompanyHackathonSection } from "@/components/CompanyHackathonSection"
import { CompanyTestimonialSection } from "@/components/CompanyTestimonialSection"
import { CompanyValuesSection } from "@/components/CompanyValuesSection"
import { CompanyCommunitySection } from "@/components/CompanyCommunitySection"
import { CompanyCompanySection } from "@/components/CompanyCompanySection"
import { CompanyFooter } from "@/components/CompanyFooter"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
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
      <CompanyStatsSection />
      <CompanyHackathonSection />
      <CompanyTestimonialSection />
      <CompanyValuesSection />
      <CompanyCommunitySection />
      <CompanyCompanySection />
      <CompanyFooter />
    </div>
  )
}