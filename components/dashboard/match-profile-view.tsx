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
    <div className="min-h-screen bg-background px-4 py-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard/discover" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-secondary/50 backdrop-blur-sm hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary backdrop-blur-md"
            >
              <Heart className="mr-1.5 size-3.5 fill-primary" />
              Match Profile
            </Badge>
            {typeof compatibility === 'number' ? (
              <Badge
                variant="outline"
                className="border-border/50 bg-background/50 font-mono backdrop-blur-md"
              >
                <Sparkles className="mr-1.5 size-3.5 text-yellow-500" />
                {compatibility}% Compatible
              </Badge>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 flex flex-col gap-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl">
                <Image
                  src={image}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 flex flex-col gap-2 p-8 text-white">
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading text-4xl font-bold tracking-tight">
                      {profile.name}
                      {profile.age ? `, ${profile.age}` : ''}
                    </h1>
                    <CheckCircle2 className="size-6 text-blue-400" />
                  </div>
                  {profile.location ? (
                    <div className="flex items-center text-white/80">
                      <MapPin className="mr-1.5 size-4" />
                      <span className="text-sm font-medium">{profile.location}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleInvite}
                  disabled={isInviting}
                  className="w-full h-14 rounded-2xl bg-primary text-base font-semibold shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02]"
                >
                  {isInviting ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <Video className="mr-2 size-5" />
                  )}
                  Invite to Virtual Date
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 rounded-xl bg-secondary/60 hover:bg-secondary"
                  >
                    <MessageCircle className="mr-2 size-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
                  >
                    <Calendar className="mr-2 size-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            {typeof compatibility === 'number' ? (
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-heading text-2xl font-semibold flex items-center gap-2">
                        <Sparkles className="size-6 text-primary" />
                        Compatibility
                      </h3>
                      <p className="text-muted-foreground">
                        Based on shared interests and date preferences.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-heading text-4xl font-bold text-primary">
                        {compatibility}%
                      </span>
                      <Progress value={compatibility} className="h-2 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-xl font-semibold">About {profile.name}</h3>
              <Card className="bg-card/40 backdrop-blur-md">
                <CardContent className="p-6 text-lg leading-relaxed text-card-foreground/90">
                  {profile.bio || 'No bio yet.'}
                </CardContent>
              </Card>
            </div>

            {interests.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h3 className="font-heading text-xl font-semibold">Interests & Vibe</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="bg-card/40 backdrop-blur-md">
                    <CardContent className="flex flex-col gap-4 p-5">
                      <div className="flex items-center gap-2 font-medium text-muted-foreground">
                        <Heart className="size-4" /> Passions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="px-3 py-1 text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/40 backdrop-blur-md">
                    <CardContent className="flex flex-col gap-4 p-5">
                      <div className="flex items-center gap-2 font-medium text-muted-foreground">
                        <Music className="size-4" /> Interests
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-foreground">
                        {interests.slice(0, 3).map((interest) => (
                          <p key={interest}>• {interest}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold">Suggested Dates</h3>
                <span className="text-sm text-muted-foreground">Pick an environment</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedEnvironments.map((env) => (
                  <div
                    key={env.id}
                    onClick={() => setSelectedEnv(env.id as EnvironmentType)}
                    className={`group relative flex cursor-pointer items-end overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg ${selectedEnv === env.id ? 'border-primary ring-2 ring-primary' : 'border-border/50'}`}
                  >
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={env.image || '/placeholder.svg'}
                        alt={env.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                    <div className="relative z-10 flex w-full flex-col text-white">
                      <span className="text-xs font-medium text-white/70">{env.mood}</span>
                      <span className="font-heading text-lg font-semibold">{env.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
