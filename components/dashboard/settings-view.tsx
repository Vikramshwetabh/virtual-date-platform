'use client'

import { useEffect, useState } from 'react'
import { Copy, Settings, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { users } from '@/lib/api'

export function SettingsView() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    users.getMe()
      .then(setProfile)
      .finally(() => setIsLoading(false))
  }, [])

  const copyUserId = async () => {
    if (!profile?.id) return
    await navigator.clipboard.writeText(profile.id)
    toast.success('User ID copied to clipboard')
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-muted-foreground">
        Loading settings...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Settings className="size-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and share your profile ID with matches.
        </p>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{profile?.name || 'Your profile'}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Your User ID</p>
            <p className="text-sm text-muted-foreground">
              Share this ID so others can find your profile on Discover.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <code className="flex-1 rounded-lg border border-border/50 bg-background/60 px-4 py-3 text-sm font-mono break-all">
                {profile?.id}
              </code>
              <Button variant="outline" onClick={copyUserId} disabled={!profile?.id}>
                <Copy className="size-4 mr-2" />
                Copy ID
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
