'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center border border-white/5 bg-gradient-to-br from-[#1b1522]/30 via-card/10 to-[#120f1a]/50 backdrop-blur-md rounded-[2.5rem] max-w-md mx-auto shadow-xl animate-fade-in-up">
          <div className="size-16 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6 shadow-inner">
            <AlertTriangle className="size-8 text-destructive animate-bounce" />
          </div>
          <h3 className="text-xl font-heading font-extrabold text-white mb-2.5">Something went wrong</h3>
          <p className="text-muted-foreground/90 text-sm leading-relaxed mb-6 max-w-xs">
            An unexpected error occurred in this section of the platform.
          </p>
          <Button
            onClick={this.handleRetry}
            className="h-11 px-5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <RefreshCw className="size-4 mr-2 animate-spin-slow" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
