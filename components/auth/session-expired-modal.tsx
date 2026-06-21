'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SessionExpiredModal() {
  const { isSessionExpired, logout, setIsSessionExpired } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSessionExpired && pathname !== '/login') {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isSessionExpired, pathname]);

  if (!isOpen) return null;

  const handleSignInAgain = () => {
    setIsOpen(false);
    setIsSessionExpired(false);
    logout();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex w-full max-w-sm flex-col items-center justify-center space-y-6 rounded-3xl border border-white/10 bg-[#1b1522] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-lg shadow-destructive/10">
          <AlertTriangle className="size-8" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="font-heading text-xl font-bold text-white">Session Expired</h3>
          <p className="text-sm text-muted-foreground/90">
            For your security, your session has expired. Please sign in again.
          </p>
        </div>
        <Button 
          onClick={handleSignInAgain} 
          className="w-full h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
        >
          Sign In Again
        </Button>
      </div>
    </div>
  );
}
