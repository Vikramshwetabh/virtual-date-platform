'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthenticated, user, fetchCurrentUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function hydrateAuth() {
      if (!token) {
        router.push('/login');
      } else {
        if (!user) {
          try {
            await fetchCurrentUser();
          } catch (err) {
            console.error("Auth hydration failed:", err);
            router.push('/login');
            return;
          }
        }
        setIsChecking(false);
      }
    }
    hydrateAuth();
  }, [token, isAuthenticated, user, fetchCurrentUser, router]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading...</div>;
  }

  return <>{children}</>;
}