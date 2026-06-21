'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { SuccessState } from '@/components/auth/success-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setServerError('');
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/80 to-[#120f1a]/80 p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {isSuccess ? (
          <SuccessState 
            title="Check Your Email"
            message="Check your email for password reset instructions."
            ctaText="Return to Login"
            ctaHref="/login"
          />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-2xl font-bold text-white">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  disabled={isLoading}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email.message as string}</p>}
                {serverError && <p className="text-xs text-red-400 font-medium">{serverError}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
                <ArrowLeft className="mr-2 size-4" />
                Back to log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
