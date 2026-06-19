'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Logo } from '@/components/logo'
import { environments, interestOptions } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { users } from '@/lib/api'

const avatars = [
  '/images/avatar-a.png',
  '/images/avatar-b.png',
  '/images/avatar-c.png',
  '/images/avatar-d.png',
]

const steps = [
  'Profile photo',
  'Your interests',
  'Date environments',
  'Choose avatar',
]

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [interests, setInterests] = useState<string[]>([])
  const [envs, setEnvs] = useState<string[]>([])
  const [avatar, setAvatar] = useState<string | null>(null)
  const [photo, setPhoto] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const progress = ((step + 1) / steps.length) * 100
  const isLast = step === steps.length - 1

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    )
  }

  async function next() {
    if (isLast) {
      setIsLoading(true)
      try {
        // The API documentation uses 'avatar', not 'avatarUrl'
        // It also doesn't mention 'interests', but we can send 'bio' as an example
        await users.updateMe({ avatar: avatar || undefined, bio: `My interests: ${interests.join(', ')}` });
        toast.success('Profile setup complete!')
        router.push('/dashboard')
      } catch (error: any) {
        toast.error(error.message || 'Failed to save profile setup');
      } finally {
        setIsLoading(false)
      }
    } else {
      setStep((s) => s + 1)
    }
  }

  const canProceed =
    (step === 0) || // Profile photo can be skipped for now
    (step === 1 && interests.length > 0) ||
    (step === 2 && envs.length > 0) ||
    (step === 3 && avatar !== null)

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 justify-between">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Virtual Date home" className="transition-transform duration-300 hover:scale-105">
          <Logo />
        </Link>
        <Link href="/dashboard" passHref>
          <Button variant="ghost" className="text-xs font-semibold tracking-wide uppercase text-muted-foreground hover:text-foreground hover:bg-foreground/5">
            Skip for now
          </Button>
        </Link>
      </header>

      <div className="mt-8 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-primary font-bold">{steps[step]}</span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary border border-border/20 [&>div]:bg-primary" />
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        <div className="relative w-full rounded-[2rem] border border-border bg-card p-8 md:p-10 shadow-xl animate-fade-in-up overflow-hidden">
          {/* Step 1: Profile photo */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  Add a profile photo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Show your best self. You can always change this later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhoto((p) => !p)}
                className={cn(
                  'group relative flex size-44 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary/50 transition-all duration-200 hover:border-primary shadow-inner',
                  photo && 'border-solid border-primary ring-4 ring-primary/20',
                )}
              >
                {photo ? (
                  <Image
                    src="/images/person-1.png"
                    alt="Your profile photo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
                    <Camera className="size-8" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Tap to upload</span>
                  </span>
                )}
              </button>
              <Button variant="outline" className="border-border hover:bg-foreground/5" onClick={() => setPhoto(true)}>
                <Upload data-icon="inline-start" />
                {photo ? 'Change photo' : 'Upload photo'}
              </Button>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  What are you into?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pick a few interests to help us find your people.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {interestOptions.map((interest) => {
                  const active = interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggle(interests, setInterests, interest)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                        active
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-foreground',
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Environments */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  Favorite date spots
                </h1>
                <p className="text-sm text-muted-foreground">
                  Which virtual environments sound like your kind of date?
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {environments.map((env) => {
                  const active = envs.includes(env.id)
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => toggle(envs, setEnvs, env.id)}
                      className={cn(
                        'group relative overflow-hidden rounded-2xl border text-left transition-all duration-200',
                        active ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary/40',
                      )}
                    >
                      <Image
                        src={env.image || '/placeholder.svg'}
                        alt={env.name}
                        width={400}
                        height={240}
                        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      {active && (
                        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                          <Check className="size-3.5" />
                        </span>
                      )}
                      <span className="absolute bottom-3.5 left-3.5 font-heading font-bold text-lg text-white">
                        {env.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Avatar */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  Choose your avatar
                </h1>
                <p className="text-sm text-muted-foreground">
                  This is how you&apos;ll appear on your virtual dates.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {avatars.map((src) => {
                  const active = avatar === src
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setAvatar(src)}
                      className={cn(
                        'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-200',
                        active ? 'border-primary ring-2 ring-primary shadow-sm' : 'border-border hover:border-primary/50',
                      )}
                    >
                      <Image
                        src={src || '/placeholder.svg'}
                        alt="Avatar option"
                        fill
                        className="object-cover"
                      />
                      {active && (
                        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6 mt-4">
        <Button
          variant="ghost"
          className="hover:bg-foreground/5 rounded-xl"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button size="lg" className="h-11 px-5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-95 shadow-md shadow-primary/20 transition-all duration-200" onClick={next} disabled={!canProceed || isLoading}>
          {isLoading ? 'Saving...' : isLast ? 'Finish & explore' : 'Continue'}
          {!isLast && <ArrowRight data-icon="inline-end" />}
        </Button>
      </div>
    </div>
  )
}
