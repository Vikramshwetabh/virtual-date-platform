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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Heart className="size-8 text-primary fill-primary" />
          My Matches
        </h1>
        <p className="text-muted-foreground text-lg">
          People you matched with. Jump into your shared virtual dating rooms.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-colors">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-14 border border-border/50">
                    <AvatarImage src={match.avatar || undefined} alt={match.name} />
                    <AvatarFallback>{match.name?.charAt(0) || 'M'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{match.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{match.bio || 'Matched connection'}</p>
                  </div>
                </div>
                {match.roomId ? (
                  <Link href={`/dashboard/date/${match.roomId}`} passHref>
                    <Button size="sm" className="shrink-0 gap-1.5 shadow-md shadow-primary/20">
                      <Video className="size-4" /> Date
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" disabled className="shrink-0 text-xs">
                    No Room
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="size-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No mutual matches yet</h3>
          <p className="text-muted-foreground max-w-sm">Keep discovering and matching with others to schedule dates!</p>
        </div>
      )}
    </div>
  );
}
