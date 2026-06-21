'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { SuccessState } from '@/components/auth/success-state';
import { Button } from '@/components/ui/button';

const schema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function ResetPasswordPage() {
  const { resetPassword } = useAuthStore();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  });

  const otpValue = watch('otp');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setServerError('');
    try {
      await resetPassword(data.otp, data.password);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/80 to-[#120f1a]/80 p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {isSuccess ? (
          <SuccessState 
            title="Password Updated Successfully"
            message="You can now log in with your new password."
            ctaText="Go To Login"
            ctaHref="/login"
          />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-2xl font-bold text-white">Create New Password</h1>
              <p className="text-sm text-muted-foreground">
                Please enter the 6-digit OTP code sent to your email and choose a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setValue('otp', e.target.value.replace(/\D/g, ''))} // Only allow digits
                  disabled={isLoading}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-center text-lg font-mono tracking-widest text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="000000"
                />
                {errors.otp && <p className="text-xs text-red-400 font-medium">{errors.otp.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
                <input
                  type="password"
                  {...register('password')}
                  disabled={isLoading}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-xs text-red-400 font-medium">{errors.confirmPassword.message as string}</p>}
                {serverError && <p className="text-xs text-red-400 font-medium mt-2">{serverError}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

