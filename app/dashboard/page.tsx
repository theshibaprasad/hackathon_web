import { getServerSideUser } from '@/lib/auth';
import DashboardClient from './DashboardClient';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Server-side authentication check
  const user = await getServerSideUser();
  
  if (!user) {
    // This will never be reached due to middleware, but just in case
    return null;
  }

  return <DashboardClient user={user} />;
}
