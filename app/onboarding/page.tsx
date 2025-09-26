import { getServerSideUser } from '@/lib/auth';
import OnboardingClient from './OnboardingClient';
import OnboardingGuard from '@/components/OnboardingGuard';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // Server-side authentication check
  const user = await getServerSideUser();
  
  if (!user) {
    // This will never be reached due to middleware, but just in case
    return null;
  }

  return (
    <OnboardingGuard>
      <OnboardingClient user={user} />
    </OnboardingGuard>
  );
}
