'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Compass, UserRound } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { users } from '@/lib/api'
import type { ApiUser } from '@/lib/types/api'

function parseInterests(user: ApiUser): string[] {
  if (user.interests?.length) {
    return user.interests
  }
  if (user.bio?.toLowerCase().startsWith('my interests:')) {
    return user.bio
      .slice('my interests:'.length)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function DiscoverView() {
  const [people, setPeople] = useState<ApiUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadDiscoverUsers = useCallback(async () => {
    setIsLoading(true)

    try {
      const data = await users.getDiscover()
      setPeople(data.users ?? [])
    } catch (err: any) {
      setPeople([])
      toast.error(err.message || 'Failed to load discover users')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDiscoverUsers()
  }, [loadDiscoverUsers])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-foreground">
          <Compass className="size-8 text-primary" />
          Discover
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Browse people to connect with. Open a profile to invite them to a virtual date.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 w-full bg-card/50 animate-pulse rounded-3xl border border-border" />
          ))}
        </div>
      ) : people.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => {
            const interests = parseInterests(person)

            return (
              <Card
                key={person.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="p-0 flex flex-col h-full justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                      <Avatar className="size-full rounded-none">
                        <AvatarImage src={person.avatar || undefined} alt={person.name} className="object-cover" />
                        <AvatarFallback>{person.name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{person.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block text-xs font-semibold text-accent uppercase tracking-wider">92% Spark</span>
                        <span className="group/tooltip relative inline-flex size-3.5 items-center justify-center rounded-full bg-secondary text-[10px] text-muted-foreground cursor-help border border-border" title="Spark Score is calculated based on shared core values, matching interests, and dates preferences.">
                          ?
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-lg bg-popover border border-border p-2.5 text-[11px] leading-normal text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/tooltip:opacity-100">
                            Represents compatibility based on onboarding preferences and favorite dating environments.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground/90 line-clamp-3 leading-relaxed flex-1">
                    {person.bio || 'No bio yet.'}
                  </p>

                  {interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {interests.slice(0, 3).map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 hover:bg-primary/20">
                          {interest}
                        </Badge>
                      ))}
                      {interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-secondary/30 text-muted-foreground border border-border px-2 py-0.5">
                          +{interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  ) : null}

                  <Button
                    variant="secondary"
                    className="w-full h-10 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground hover:border-transparent font-semibold shadow-sm transition-all duration-200"
                    render={<Link href={`/dashboard/discover/${person.id}`} />}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-3xl bg-card shadow-sm">
          <UserRound className="size-12 text-primary/40 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No users available yet</h3>
          <p className="text-muted-foreground/80 max-w-sm text-sm">
            Check back soon for new people to connect with.
          </p>
        </div>
      )}
    </div>
  )
}
