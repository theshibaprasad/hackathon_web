import { redirect } from 'next/navigation';
import { getServerSideUser } from '@/lib/auth';

interface ServerAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default async function ServerAuthGuard({ 
  children, 
  fallback 
}: ServerAuthGuardProps) {
  const user = await getServerSideUser();
  
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect('/login');
  }

  return <>{children}</>;
}


