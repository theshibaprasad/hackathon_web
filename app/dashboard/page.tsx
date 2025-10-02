import { getServerSideUser } from '@/lib/auth';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardClient = lazy(() => import('./DashboardClient'));

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Server-side authentication check
  const user = await getServerSideUser();
  
  if (!user) {
    // This will never be reached due to middleware, but just in case
    return null;
  }

  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <DashboardClient user={user} />
    </Suspense>
  );
}
