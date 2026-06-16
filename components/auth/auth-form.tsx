'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { GoogleIcon } from '@/components/auth/google-icon'

const inputClass = 'h-11'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const [showEmail, setShowEmail] = useState(false)
  const isSignup = mode === 'signup'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(isSignup ? '/onboarding' : '/dashboard')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11"
          onClick={() => router.push(isSignup ? '/onboarding' : '/dashboard')}
        >
          <GoogleIcon className="size-4" data-icon="inline-start" />
          Continue with Google
        </Button>
        {!showEmail && (
          <Button
            variant="outline"
            size="lg"
            className="h-11"
            onClick={() => setShowEmail(true)}
          >
            <Mail data-icon="inline-start" />
            Continue with Email
          </Button>
        )}
      </div>

      {showEmail && (
        <>
          <FieldSeparator>or</FieldSeparator>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {isSignup && (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Alex Rivera"
                    className={inputClass}
                    required
                  />
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </Field>
              <Button type="submit" size="lg" className="h-11 w-full">
                {isSignup ? 'Create account' : 'Log in'}
              </Button>
            </FieldGroup>
          </form>
        </>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isSignup ? '/login' : '/signup'}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>

      {isSignup && (
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{' '}
          <a href="#" className="underline underline-offset-4">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      )}
    </div>
  )
}
