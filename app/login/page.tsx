import React from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { GuestGuard } from '@/components/auth/guest-guard';

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </div>
    </GuestGuard>
  );
}