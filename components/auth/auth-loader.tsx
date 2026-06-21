import React from 'react';
import { Loader2 } from 'lucide-react';

export function AuthLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="relative flex items-center justify-center mb-2">
        <div className="absolute size-16 rounded-full border-4 border-primary/20 animate-ping" />
        <Loader2 className="size-10 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-sm font-semibold tracking-wider text-muted-foreground/80 animate-pulse uppercase">
        {message}
      </p>
    </div>
  );
}
