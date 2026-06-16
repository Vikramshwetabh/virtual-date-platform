'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/components/onboarding/auth-store';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token || isAuthenticated) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [token, isAuthenticated, router]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading...</div>;
  }

  return <>{children}</>;
}