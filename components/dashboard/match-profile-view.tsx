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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { matches, environments } from '@/lib/data'

// For demonstration, we'll use Maya (matches[0])
const match = matches[0]
const suggestedEnvironments = environments.slice(0, 4)

export function MatchProfileView() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary/50 backdrop-blur-sm hover:bg-secondary"
            asChild
          >
            <Link href="/dashboard/matches">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary backdrop-blur-md"
            >
              <Heart className="mr-1.5 size-3.5 fill-primary" />
              New Match
            </Badge>
            <Badge
              variant="outline"
              className="border-border/50 bg-background/50 font-mono backdrop-blur-md"
            >
              <Sparkles className="mr-1.5 size-3.5 text-yellow-500" />
              {match.compatibility}% Compatible
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Sticky Profile Card */}
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 flex flex-col gap-6">
              {/* Main Photo Card */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl">
                <Image
                  src={match.image}
                  alt={match.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 inset-x-0 flex flex-col gap-2 p-8 text-white">
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading text-4xl font-bold tracking-tight">
                      {match.name}, {match.age}
                    </h1>
                    <CheckCircle2 className="size-6 text-blue-400" />
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="mr-1.5 size-4" />
                    <span className="text-sm font-medium">{match.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl bg-primary text-base font-semibold shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02]"
                  asChild
                >
                  <Link href="/dashboard/date/active">
                    <Video className="mr-2 size-5" />
                    Invite to Virtual Date
                  </Link>
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

          {/* Right Column: Details */}
          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            
            {/* Compatibility Card */}
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl font-semibold flex items-center gap-2">
                      <Sparkles className="size-6 text-primary" /> 
                      Highly Compatible
                    </h3>
                    <p className="text-muted-foreground">
                      Based on your shared love for indie film and quiet mornings.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-heading text-4xl font-bold text-primary">
                      {match.compatibility}%
                    </span>
                    <Progress value={match.compatibility} className="h-2 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-xl font-semibold">About {match.name}</h3>
              <Card className="bg-card/40 backdrop-blur-md">
                <CardContent className="p-6 text-lg leading-relaxed text-card-foreground/90">
                  {match.bio}
                </CardContent>
              </Card>
            </div>

            {/* Interests Section */}
            <div className="flex flex-col gap-6">
              <h3 className="font-heading text-xl font-semibold">Interests & Vibe</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-card/40 backdrop-blur-md">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="flex items-center gap-2 font-medium text-muted-foreground">
                      <Heart className="size-4" /> Passions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.interests.map((interest) => (
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
                      <Music className="size-4" /> Music & Media
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-foreground">
                      <p>• Indie Folk & Jazz Playlists</p>
                      <p>• A24 Films & Documentaries</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Suggested Environments */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold">Suggested Dates</h3>
                <span className="text-sm text-muted-foreground">Highest Match</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedEnvironments.map((env) => (
                  <div
                    key={env.id}
                    className="group relative flex cursor-pointer items-end overflow-hidden rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg"
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