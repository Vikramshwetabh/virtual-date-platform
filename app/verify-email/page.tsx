'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AuthLoader } from '@/components/auth/auth-loader';
import { AuthErrorState } from '@/components/auth/auth-error-state';
import { SuccessState } from '@/components/auth/success-state';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid or missing verification token.');
      return;
    }

    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Verification failed. The token may be expired.');
      });
  }, [token, verifyEmail]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/80 to-[#120f1a]/80 p-8 shadow-2xl backdrop-blur-xl">
      {status === 'loading' && <AuthLoader message="Verifying your email..." />}
      {status === 'success' && (
        <SuccessState 
          title="Email Verified!" 
          message="Your email has been successfully verified. Welcome to Virtual Date."
          ctaText="Start Discovering Matches"
          ctaHref="/dashboard"
        />
      )}
      {status === 'error' && (
        <AuthErrorState 
          title="Verification Failed"
          message={errorMsg}
          retryLabel="Go to Login"
          onRetry={() => window.location.href = '/login'}
        />
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<AuthLoader message="Loading..." />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
