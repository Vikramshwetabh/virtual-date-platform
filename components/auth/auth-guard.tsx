'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, fetchCurrentUser, hasHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

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
  }, [token, user, fetchCurrentUser, router, hasHydrated]);

  if (!hasHydrated || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#120f1a] text-foreground">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute size-12 rounded-full border-4 border-primary/20 animate-ping" />
          <div className="size-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wider text-muted-foreground/80 animate-pulse">Securing session...</p>
      </div>
    );
  }

  return <>{children}</>;
}