'use client';

import { useEffect, useState } from 'react';
import { users } from '@/lib/api';
import { Heart, Video, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await users.getMatches();
        // Handle both object { matches: [] } and raw array
        const list = Array.isArray(res) ? res : res?.matches || [];
        setMatches(list);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-foreground">
          <Heart className="size-8 text-primary" />
          My Matches
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          People you matched with. Jump into your shared virtual dating rooms.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 w-full bg-card/50 animate-pulse rounded-[2rem] border border-border" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative size-14 rounded-2xl overflow-hidden border border-border group-hover:border-primary/40 transition-colors shrink-0 shadow-md">
                    <Avatar className="size-full rounded-none">
                      <AvatarImage src={match.avatar || undefined} alt={match.name} className="object-cover" />
                      <AvatarFallback>{match.name?.charAt(0) || 'M'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors">{match.name}</h3>
                    <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{match.bio || 'Matched connection'}</p>
                  </div>
                </div>
                {match.roomId ? (
                  <Link href={`/dashboard/date/${match.roomId}`} passHref>
                    <Button size="sm" className="shrink-0 h-10 px-5 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-200">
                      <Video className="size-4 mr-1.5" /> Date
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" disabled className="shrink-0 text-xs rounded-xl h-10 px-4">
                    No Room
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-border rounded-3xl bg-card shadow-sm max-w-md mx-auto">
          <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
            <Heart className="size-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No mutual matches yet</h3>
          <p className="text-muted-foreground/90 max-w-sm text-sm mb-6">
            Keep discovering and matching with others to schedule virtual dates!
          </p>
          <Link href="/dashboard/discover" passHref>
            <Button className="h-10 px-5 bg-primary text-primary-foreground font-semibold rounded-xl transition-all duration-200">
              Go to Discover
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
