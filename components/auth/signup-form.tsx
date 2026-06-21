'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signup(data);
      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col justify-center space-y-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/80 via-card/50 to-[#120f1a]/80 p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute -top-20 -right-20 -z-10 size-48 rounded-full bg-primary/15 blur-[60px]" />
      <div className="absolute -bottom-20 -left-20 -z-10 size-48 rounded-full bg-accent/10 blur-[60px]" />

      <div className="flex flex-col space-y-3 text-center">
        <div className="flex justify-center mb-1">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20 animate-float">
            <svg className="size-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to build your virtual profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.name && <p className="text-xs text-red-400 mt-1 font-medium">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.email && <p className="text-xs text-red-400 mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.password && <p className="text-xs text-red-400 mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-95 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm text-muted-foreground pt-2">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}