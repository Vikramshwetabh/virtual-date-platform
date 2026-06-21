import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SuccessStateProps {
  title: string;
  message: string;
  ctaText?: string;
  ctaHref?: string;
  onAction?: () => void;
}

export function SuccessState({ 
  title, 
  message, 
  ctaText, 
  ctaHref, 
  onAction 
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-500/10 mb-2">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
        <CheckCircle2 className="size-10 relative z-10" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="font-heading text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-muted-foreground/90 leading-relaxed">{message}</p>
      </div>
      
      {(ctaHref || onAction) && (
        <div className="w-full pt-4">
          {ctaHref ? (
            <Link href={ctaHref} passHref legacyBehavior>
              <Button className="w-full h-12 text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 rounded-xl transition-all hover:scale-[1.02]">
                {ctaText || 'Continue'}
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} className="w-full h-12 text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 rounded-xl transition-all hover:scale-[1.02]">
              {ctaText || 'Continue'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
