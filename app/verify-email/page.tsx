'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { AuthLoader } from '@/components/auth/auth-loader';
import { SuccessState } from '@/components/auth/success-state';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit code.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await verifyEmail(otp);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Verification failed. Please check your code and try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/80 to-[#120f1a]/80 p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {status === 'success' ? (
          <SuccessState 
            title="Email Verified!" 
            message="Your email has been successfully verified. Welcome to Virtual Date."
            ctaText="Start Discovering Matches"
            ctaHref="/dashboard"
          />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-2xl font-bold text-white">Verify Your Email</h1>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit OTP code sent to your email.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {status === 'error' && errorMsg && (
                <div className="text-xs text-red-400 font-medium text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow digits
                  placeholder="000000"
                  className="block w-full text-center text-3xl tracking-[0.5em] font-mono rounded-xl border border-white/10 bg-secondary/30 px-3 py-3 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  disabled={status === 'loading'}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {status === 'loading' ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

