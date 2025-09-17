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
    <div className="min-h-screen bg-background">
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