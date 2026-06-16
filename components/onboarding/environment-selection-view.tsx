'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Flame,
  MessageCircle,
  Play,
  Sparkles,
  Star,
} from 'lucide-react'

import { environments } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Enhance the existing environment data with page-specific features
const enhancedEnvironments = environments.map((env) => {
  let popularity = null
  let features = [
    'Immersive ambient audio',
    'Private secure voice channel',
    'High-quality 3D spatial sound',
  ]
  let topics = [
    'What drew you to this atmosphere?',
    'What does your ideal weekend look like?',
  ]

  if (env.id === 'coffee') {
    popularity = { label: 'Most Popular', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' }
    topics = ['What is your go-to coffee order?', 'Are you more of a morning or night person?']
  } else if (env.id === 'park') {
    popularity = { label: 'Trending', icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' }
    topics = ['What is your favorite outdoor activity?', 'Do you have any pets?']
  } else if (env.id === 'beach') {
    popularity = { label: 'Highly Rated', icon: Star, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' }
    topics = ['What is your favorite travel destination?', 'What relaxes you the most after a long day?']
  }

  return { ...env, popularity, features, topics }
})

export function EnvironmentSelectionView() {
  const [selectedEnv, setSelectedEnv] = useState(enhancedEnvironments[0])

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20 lg:py-24">
        {/* Hero Section */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Atmosphere</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Select the perfect environment for your virtual date. Each space is carefully crafted to spark different kinds of conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Environment List */}
          <div className="flex flex-col gap-4 lg:col-span-7 xl:col-span-8">
            {enhancedEnvironments.map((env) => {
              const isSelected = selectedEnv.id === env.id

              return (
                <div
                  key={env.id}
                  onClick={() => setSelectedEnv(env)}
                  className={cn(
                    'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card/40 p-4 transition-all duration-300 ease-out hover:border-primary/40 hover:bg-card/60 sm:flex-row sm:items-center sm:gap-6 sm:p-5 backdrop-blur-sm',
                    isSelected
                      ? 'border-primary ring-1 ring-primary bg-gradient-to-r from-primary/10 to-transparent shadow-[0_0_30px_-5px_rgba(var(--primary),0.15)]'
                      : 'border-border/50'
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-48">
                    <Image
                      src={env.image || '/placeholder.svg'}
                      alt={env.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                    
                    {env.popularity && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'absolute left-3 top-3 border backdrop-blur-md',
                          env.popularity.bg,
                          env.popularity.color
                        )}
                      >
                        <env.popularity.icon className="mr-1.5 size-3" />
                        {env.popularity.label}
                      </Badge>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-4 flex flex-1 flex-col sm:mt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-card-foreground">
                          {env.name}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                            {env.mood}
                          </Badge>
                          <Badge variant="outline" className="border-border/50 bg-background/50 text-muted-foreground font-mono">
                            <Clock className="mr-1.5 size-3" />
                            {env.duration}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Mobile Select Indicator */}
                      <div className={cn(
                        "flex size-6 items-center justify-center rounded-full border-2 transition-colors sm:hidden",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {isSelected && <CheckCircle2 className="size-4 text-primary-foreground" />}
                      </div>
                    </div>
                    
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {env.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Preview Panel */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-8 flex flex-col gap-6">
              <Card className="overflow-hidden border-border/50 bg-card/60 shadow-2xl backdrop-blur-xl">
                {/* Big Preview Image */}
                <div className="relative aspect-video w-full">
                  <Image
                    src={selectedEnv.image || '/placeholder.svg'}
                    alt={selectedEnv.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
                      {selectedEnv.name}
                    </h2>
                    <p className="text-sm font-medium text-white/80">
                      {selectedEnv.mood}
                    </p>
                  </div>
                </div>

                <CardContent className="flex flex-col gap-6 p-6">
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedEnv.description}
                  </p>

                  <hr className="border-border/50" />

                  {/* Features */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Experience Features
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {selectedEnv.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="size-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="border-border/50" />

                  {/* Recommended Topics */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Conversation Starters
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {selectedEnv.topics.map((topic, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-background/50 p-3">
                          <MessageCircle className="mt-0.5 size-4 shrink-0 text-blue-400" />
                          <span className="text-sm text-muted-foreground leading-snug">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="lg"
                    className="mt-2 h-14 w-full rounded-xl bg-primary text-base font-semibold shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02]"
                    asChild
                  >
                    <Link href="/dashboard/date/active">
                      Start Virtual Date
                      <Play className="ml-2 size-5" />
                    </Link>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your video will not turn on automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}