import React from 'react';
import { SignupForm } from '@/components/auth/signup-form';
import { GuestGuard } from '@/components/auth/guest-guard';

export default function SignupPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center p-4">
        <SignupForm />
      </div>
    </GuestGuard>
  );
}