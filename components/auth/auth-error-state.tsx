import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: React.ReactNode;
}

export function AuthErrorState({ 
  title = 'Authentication Error', 
  message, 
  onRetry, 
  retryLabel = 'Try Again',
  action
}: AuthErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-lg shadow-destructive/10">
        <AlertTriangle className="size-8" />
      </div>
      <div className="space-y-2 max-w-xs">
        <h3 className="font-heading text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-muted-foreground/90">{message}</p>
      </div>
      <div className="flex flex-col w-full space-y-3 pt-2">
        {action ? (
          action
        ) : onRetry ? (
          <Button 
            onClick={onRetry} 
            className="w-full h-11 bg-destructive/90 hover:bg-destructive text-destructive-foreground font-bold shadow-lg shadow-destructive/20"
          >
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
