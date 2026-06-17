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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Compass className="size-8 text-primary" />
          Discover
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse people to connect with. Open a profile to invite them to a virtual date.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : people.length > 0 ? (
        <div className="grid gap-4">
          {people.map((person) => {
            const interests = parseInterests(person)

            return (
              <Card
                key={person.id}
                className="bg-card/60 backdrop-blur-sm border-border/50 transition-colors hover:border-primary/40"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar className="size-14 shrink-0">
                    <AvatarImage src={person.avatar || undefined} alt={person.name} />
                    <AvatarFallback>{person.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{person.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {person.bio || 'No bio yet.'}
                    </p>
                    {interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <Button
                    className="shrink-0"
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
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <UserRound className="size-10 text-primary/60 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No users available yet</h3>
          <p className="text-muted-foreground max-w-md">
            Check back soon for new people to connect with.
          </p>
        </div>
      )}
    </div>
  )
}
