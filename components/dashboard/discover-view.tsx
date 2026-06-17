'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Compass, Search, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { invitations, users } from '@/lib/api'
import { enrichInvitationsWithSenders } from '@/lib/invitation-utils'
import { useAuthStore } from '@/store/auth-store'
import type { ApiUser } from '@/lib/types/api'

export function DiscoverView() {
  const router = useRouter()
  const currentUserId = useAuthStore((s) => s.user?.id)
  const [people, setPeople] = useState<ApiUser[]>([])
  const [userIdInput, setUserIdInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDiscoverUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const me = await users.getMe()
      const selfId = me?.id ?? currentUserId
      const byId = new Map<string, ApiUser>()

      try {
        const data = await invitations.getPending()
        const enriched = await enrichInvitationsWithSenders(data.invitations ?? [])
        for (const invitation of enriched) {
          if (invitation.sender?.id && invitation.sender.id !== selfId) {
            byId.set(invitation.sender.id, invitation.sender as ApiUser)
          }
        }
      } catch {
        // Invitations may be empty; discover still works via user ID lookup.
      }

      setPeople(Array.from(byId.values()))
    } catch (err: any) {
      setError(err.message || 'Failed to load discover users')
    } finally {
      setIsLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    loadDiscoverUsers()
  }, [loadDiscoverUsers])

  const openProfile = (id: string) => {
    const trimmed = id.trim()
    if (!trimmed) return
    router.push(`/dashboard/discover/${trimmed}`)
  }

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

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Search className="size-4 text-primary" />
            Find by User ID
          </div>
          <p className="text-sm text-muted-foreground">
            Ask your match to copy their user ID from Settings, then paste it here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="e.g. 7b8f1a12-1234-5678-9876-abcdef123456"
              className="font-mono text-sm"
            />
            <Button onClick={() => openProfile(userIdInput)} disabled={!userIdInput.trim()}>
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : people.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold">From your invitations</h2>
          <div className="grid gap-4">
            {people.map((person) => (
              <Link key={person.id} href={`/dashboard/discover/${person.id}`}>
                <Card className="bg-card/60 backdrop-blur-sm border-border/50 transition-colors hover:border-primary/40">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage src={person.avatar || undefined} alt={person.name} />
                      <AvatarFallback>{person.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate">{person.name}</h3>
                      {person.bio ? (
                        <p className="text-sm text-muted-foreground truncate">{person.bio}</p>
                      ) : null}
                    </div>
                    <UserRound className="size-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <UserRound className="size-10 text-primary/60 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No suggested matches yet</h3>
          <p className="text-muted-foreground max-w-md">
            Use a user ID from Settings to open someone&apos;s profile and send an invitation.
          </p>
        </div>
      )}
    </div>
  )
}
