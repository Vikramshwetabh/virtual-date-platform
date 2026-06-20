'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center border border-white/5 bg-gradient-to-br from-[#1b1522]/30 via-card/10 to-[#120f1a]/50 backdrop-blur-md rounded-[2.5rem] max-w-lg mx-auto shadow-2xl animate-fade-in-up">
      <div className="size-16 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6 shadow-inner">
        <AlertCircle className="size-8 text-destructive animate-pulse" />
      </div>
      <h2 className="text-2xl font-heading font-extrabold text-white mb-2.5">Dashboard Section Failed</h2>
      <p className="text-muted-foreground/90 text-sm leading-relaxed mb-6 max-w-sm">
        We encountered a problem loading this part of your dashboard. This might be due to a temporary network issue.
      </p>
      {error.message && (
        <code className="text-xs text-destructive/80 font-mono bg-destructive/5 border border-destructive/10 px-3.5 py-2.5 rounded-xl max-w-sm block mb-8 break-words leading-normal">
          {error.message}
        </code>
      )}
      <Button
        onClick={() => reset()}
        className="h-12 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
      >
        <RefreshCw className="size-4 mr-2" /> Reload Section
      </Button>
    </div>
  );
}
