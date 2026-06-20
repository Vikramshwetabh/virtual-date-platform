'use client';

import { useEffect, useState } from 'react';
import { users } from '@/lib/api';
import { Heart, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/dashboard/empty-state';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await users.getMatches();
      // Handle both object { matches: [] } and raw array
      const list = Array.isArray(res) ? res : res?.matches || [];
      setMatches(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
      toast.error(err.message || 'Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-white">
          <Heart className="size-8 text-primary animate-pulse" />
          My Matches
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          People you matched with. Jump into your shared virtual dating rooms.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 w-full bg-[#1b1522]/30 animate-pulse rounded-[2rem] border border-white/5 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 flex-1">
                <div className="size-14 rounded-2xl bg-white/5 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-white/5 rounded-md" />
                  <div className="h-3 w-2/3 bg-white/5 rounded-md" />
                </div>
              </div>
              <div className="w-20 h-10 bg-white/5 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-destructive/20 rounded-[2.5rem] bg-destructive/5 backdrop-blur-md max-w-md mx-auto animate-fade-in-up">
          <div className="size-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20">
            <Heart className="size-8 text-destructive animate-pulse" />
          </div>
          <h3 className="text-xl font-heading font-extrabold text-white mb-2.5">Connection issue</h3>
          <p className="text-muted-foreground/90 text-sm leading-relaxed mb-6 max-w-xs">{error}</p>
          <Button onClick={loadMatches} className="h-11 px-6 bg-destructive hover:bg-destructive/80 text-white font-bold rounded-xl transition-all">
            Retry Loading
          </Button>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="group overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#1b1522]/50 via-card/30 to-[#120f1a]/80 shadow-lg hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative size-14 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/40 transition-colors shrink-0 shadow-md">
                    <Avatar className="size-full rounded-none">
                      <AvatarImage src={match.avatar || undefined} alt={match.name} className="object-cover" />
                      <AvatarFallback>{match.name?.charAt(0) || 'M'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors">{match.name}</h3>
                    <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{match.bio || 'Matched connection'}</p>
                  </div>
                </div>
                {match.roomId ? (
                  <Link href={`/dashboard/date/${match.roomId}`} passHref>
                    <Button size="sm" className="shrink-0 h-10 px-5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/20 rounded-xl transition-all duration-200 hover:scale-[1.02]">
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
        <EmptyState
          icon={Heart}
          title="No mutual matches yet"
          description="Keep discovering and matching with others to schedule virtual dates!"
          actionText="Go to Discover"
          actionHref="/dashboard/discover"
        />
      )}
    </div>
  );
}
