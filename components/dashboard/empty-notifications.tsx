import React from 'react';
import { BellRing } from 'lucide-react';

export function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500">
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary/40 border border-white/5 shadow-inner">
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl blur-md" />
        <BellRing className="size-8 text-muted-foreground/50 relative z-10" />
      </div>
      <h5 className="font-heading font-bold text-white text-base">You're all caught up!</h5>
      <p className="text-xs text-muted-foreground/70 max-w-[200px] mt-2 leading-relaxed">
        We'll notify you when you have new matches, invitations, or messages.
      </p>
    </div>
  );
}
