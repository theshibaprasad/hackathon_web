"use client";

import { lazy, ComponentType } from 'react';
import { LazyWrapper } from './LazyWrapper';

// Dynamic imports for heavy components
export const DynamicTeamMembers = lazy(() => 
  import('@/components/TeamMembers').then(module => ({ 
    default: module.TeamMembers 
  })).catch(() => ({ 
    default: () => <div>Failed to load TeamMembers</div> 
  }))
);

export const DynamicProjectSubmission = lazy(() => 
  import('@/components/ProjectSubmission').then(module => ({ 
    default: module.ProjectSubmission 
  })).catch(() => ({ 
    default: () => <div>Failed to load ProjectSubmission</div> 
  }))
);

export const DynamicHackathonDetails = lazy(() => 
  import('@/components/HackathonDetails').then(module => ({ 
    default: module.HackathonDetails 
  })).catch(() => ({ 
    default: () => <div>Failed to load HackathonDetails</div> 
  }))
);

export const DynamicHeader = lazy(() => 
  import('@/components/Header').then(module => ({ 
    default: module.Header 
  })).catch(() => ({ 
    default: () => <div>Failed to load Header</div> 
  }))
);

export const DynamicAnnouncementBanner = lazy(() => 
  import('@/components/AnnouncementBanner').then(module => ({ 
    default: module.default 
  })).catch(() => ({ 
    default: () => <div>Failed to load AnnouncementBanner</div> 
  }))
);

export const DynamicCompanyStatsSection = lazy(() => 
  import('@/components/CompanyStatsSection').then(module => ({ 
    default: module.CompanyStatsSection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyStatsSection</div> 
  }))
);

export const DynamicCompanyHackathonSection = lazy(() => 
  import('@/components/CompanyHackathonSection').then(module => ({ 
    default: module.CompanyHackathonSection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyHackathonSection</div> 
  }))
);

export const DynamicCompanyTestimonialSection = lazy(() => 
  import('@/components/CompanyTestimonialSection').then(module => ({ 
    default: module.CompanyTestimonialSection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyTestimonialSection</div> 
  }))
);

export const DynamicCompanyValuesSection = lazy(() => 
  import('@/components/CompanyValuesSection').then(module => ({ 
    default: module.CompanyValuesSection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyValuesSection</div> 
  }))
);

export const DynamicCompanyCommunitySection = lazy(() => 
  import('@/components/CompanyCommunitySection').then(module => ({ 
    default: module.CompanyCommunitySection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyCommunitySection</div> 
  }))
);

export const DynamicCompanyCompanySection = lazy(() => 
  import('@/components/CompanyCompanySection').then(module => ({ 
    default: module.CompanyCompanySection 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyCompanySection</div> 
  }))
);

export const DynamicFAQSection = lazy(() => 
  import('@/components/FAQSection').then(module => ({ 
    default: module.FAQSection 
  })).catch(() => ({ 
    default: () => <div>Failed to load FAQSection</div> 
  }))
);

export const DynamicCompanyFooter = lazy(() => 
  import('@/components/CompanyFooter').then(module => ({ 
    default: module.CompanyFooter 
  })).catch(() => ({ 
    default: () => <div>Failed to load CompanyFooter</div> 
  }))
);

// Wrapped components with loading states
export const TeamMembersWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicTeamMembers {...props} />
  </LazyWrapper>
);

export const ProjectSubmissionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicProjectSubmission {...props} />
  </LazyWrapper>
);

export const HackathonDetailsWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicHackathonDetails {...props} />
  </LazyWrapper>
);

export const HeaderWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicHeader {...props} />
  </LazyWrapper>
);

export const AnnouncementBannerWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicAnnouncementBanner {...props} />
  </LazyWrapper>
);

export const CompanyStatsSectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyStatsSection {...props} />
  </LazyWrapper>
);

export const CompanyHackathonSectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyHackathonSection {...props} />
  </LazyWrapper>
);

export const CompanyTestimonialSectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyTestimonialSection {...props} />
  </LazyWrapper>
);

export const CompanyValuesSectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyValuesSection {...props} />
  </LazyWrapper>
);

export const CompanyCommunitySectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyCommunitySection {...props} />
  </LazyWrapper>
);

export const CompanyCompanySectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyCompanySection {...props} />
  </LazyWrapper>
);

export const FAQSectionWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicFAQSection {...props} />
  </LazyWrapper>
);

export const CompanyFooterWithLoading = (props: any) => (
  <LazyWrapper type="section">
    <DynamicCompanyFooter {...props} />
  </LazyWrapper>
);

// Higher-order component for dynamic imports
export function withDynamicImport<T extends Record<string, any>>(
  importFunction: () => Promise<{ default: ComponentType<T> }>,
  fallbackType: 'card' | 'section' | 'hero' | 'page' | 'custom' = 'section'
) {
  const LazyComponent = lazy(importFunction);

  return function DynamicComponent(props: T) {
    return (
      <LazyWrapper type={fallbackType}>
        <LazyComponent {...(props as any)} />
      </LazyWrapper>
    );
  };
}

// Pre-configured dynamic imports for common patterns
export const withSectionLoading = <T extends Record<string, any>>(
  importFunction: () => Promise<{ default: ComponentType<T> }>
) => withDynamicImport(importFunction, 'section');

export const withCardLoading = <T extends Record<string, any>>(
  importFunction: () => Promise<{ default: ComponentType<T> }>
) => withDynamicImport(importFunction, 'card');

export const withPageLoading = <T extends Record<string, any>>(
  importFunction: () => Promise<{ default: ComponentType<T> }>
) => withDynamicImport(importFunction, 'page');
