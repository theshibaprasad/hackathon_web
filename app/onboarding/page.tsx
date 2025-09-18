import { getServerSideUser } from '@/lib/auth';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage() {
  // Server-side authentication check
  const user = await getServerSideUser();
  
  if (!user) {
    // This will never be reached due to middleware, but just in case
    return null;
  }

  return <OnboardingClient user={user} />;
}
