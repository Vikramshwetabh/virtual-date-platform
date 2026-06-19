'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Music,
  Sparkles,
  Video,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { environments } from '@/lib/data'
import { users, invitations } from '@/lib/api'
import type { ApiUser, EnvironmentType } from '@/lib/types/api'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

const suggestedEnvironments = environments.slice(0, 4)

type UserProfile = ApiUser & {
  interests?: string[]
  compatibility?: number
  age?: number
  location?: string
}

function parseInterests(profile: UserProfile): string[] {
  if (profile.interests?.length) {
    return profile.interests
  }
  if (profile.bio?.toLowerCase().startsWith('my interests:')) {
    return profile.bio
      .slice('my interests:'.length)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function MatchProfileView({ matchId }: { matchId: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentType>(suggestedEnvironments[0].id as EnvironmentType)
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await users.getProfile(matchId)
        setProfile(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [matchId])

  const handleInvite = async () => {
    if (!profile?.id) return
    setIsInviting(true)
    try {
      await invitations.create({
        receiverId: profile.id,
        environmentType: selectedEnv,
      })
      toast.success('Invitation sent')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <span className="animate-spin mr-2">⏳</span> Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" render={<Link href="/dashboard/discover" />}>
          Back to Discover
        </Button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Profile not found.
      </div>
    )
  }

  const interests = parseInterests(profile)
  const image = profile.avatar || '/images/person-1.png'
  const compatibility = profile.compatibility

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:p-8 lg:p-12 animate-fade-in-up">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard/discover" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary px-3 py-1 font-semibold backdrop-blur-md"
            >
              <Heart className="mr-1.5 size-3.5 fill-primary text-primary" />
              Match Profile
            </Badge>
            {typeof compatibility === 'number' ? (
              <Badge
                variant="outline"
                className="border-accent/20 bg-accent/10 text-accent font-semibold px-3 py-1 font-mono backdrop-blur-md"
              >
                <Sparkles className="mr-1.5 size-3.5 text-accent fill-current" />
                {compatibility}% Compatible
              </Badge>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column - Avatar & Core CTAs */}
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 flex flex-col gap-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-500">
                <Image
                  src={image}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 flex flex-col gap-2 p-8 text-white z-10">
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading text-4xl font-extrabold tracking-tight">
                      {profile.name}
                      {profile.age ? `, ${profile.age}` : ''}
                    </h1>
                    <CheckCircle2 className="size-6 text-blue-400 fill-current" />
                  </div>
                  {profile.location ? (
                    <div className="flex items-center text-white/80 text-sm font-medium">
                      <MapPin className="mr-1.5 size-4 text-primary" />
                      <span>{profile.location}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleInvite}
                  disabled={isInviting}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-base font-bold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
                >
                  {isInviting ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <Video className="mr-2 size-5 fill-current" />
                  )}
                  Invite to Virtual Date
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl border-white/15 bg-transparent hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    <Calendar className="mr-2 size-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Compatibility details & Bio */}
          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            {typeof compatibility === 'number' ? (
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-[#1b1522]/60 to-[#120f1a]/80 shadow-xl rounded-[2rem] hover:border-primary/40 transition-colors">
                <CardContent className="p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-heading text-2xl font-extrabold flex items-center gap-2 text-white">
                        <Sparkles className="size-6 text-primary fill-current" />
                        Compatibility Match
                      </h3>
                      <p className="text-muted-foreground/90 text-sm">
                        Based on shared interests and date preferences.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-heading text-4xl font-extrabold text-primary text-glow-primary">
                        {compatibility}%
                      </span>
                      <Progress value={compatibility} className="h-2.5 w-36 bg-secondary/60 [&>div]:bg-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-xl font-bold tracking-tight text-white">About {profile.name}</h3>
              <Card className="border-white/5 bg-card/30 backdrop-blur-md rounded-2xl hover:border-white/10 transition-colors">
                <CardContent className="p-6 text-base leading-relaxed text-muted-foreground">
                  {profile.bio || 'No bio yet.'}
                </CardContent>
              </Card>
            </div>

            {interests.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h3 className="font-heading text-xl font-bold tracking-tight text-white">Interests & Vibe</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-white/5 bg-card/30 backdrop-blur-md rounded-2xl">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-primary">
                        <Heart className="size-4 fill-primary" /> Passions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 font-medium hover:bg-primary/20 text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/5 bg-card/30 backdrop-blur-md rounded-2xl">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-accent">
                        <Music className="size-4 fill-accent" /> Interests
                      </div>
                      <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                        {interests.slice(0, 3).map((interest) => (
                          <p key={interest} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" />
                            {interest}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold tracking-tight text-white">Suggested Dates</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Pick an environment</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedEnvironments.map((env) => {
                  const isSelected = selectedEnv === env.id;
                  return (
                    <div
                      key={env.id}
                      onClick={() => setSelectedEnv(env.id as EnvironmentType)}
                      className={`group relative flex cursor-pointer items-end overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary shadow-xl shadow-primary/10 bg-primary/5' 
                          : 'border-white/10 bg-secondary/20 hover:border-primary/45'
                      }`}
                    >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={env.image || '/placeholder.svg'}
                          alt={env.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>
                      <div className="relative z-10 flex w-full flex-col text-white">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent drop-shadow-sm">{env.mood}</span>
                        <span className="font-heading text-lg font-bold tracking-tight mt-1 drop-shadow-sm">{env.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
