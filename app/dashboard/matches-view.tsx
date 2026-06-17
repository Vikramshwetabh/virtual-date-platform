'use client';

import { useEffect, useState, useCallback } from 'react';
import { invitations as apiInvitations } from '@/lib/api';
import { enrichInvitationsWithSenders } from '@/lib/invitation-utils';
import type { EnrichedInvitation } from '@/lib/types/api';
import { InvitationCard } from './invitation-card';
import { CalendarHeart, Inbox } from 'lucide-react';

const POLL_INTERVAL_MS = 15000;

export function MatchesView() {
  const [invitations, setInvitations] = useState<EnrichedInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    try {
      const data = await apiInvitations.getPending();
      const enriched = await enrichInvitationsWithSenders(data.invitations ?? []);
      setInvitations(enriched);
    } catch (error) {
      // Errors are surfaced by the API client.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
    const interval = setInterval(fetchInvitations, POLL_INTERVAL_MS);

    const handleFocus = () => {
      fetchInvitations();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchInvitations]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <CalendarHeart className="size-8 text-primary" />
          Your Invitations
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your pending virtual date requests.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/40 animate-pulse rounded-xl border border-border/50"></div>
          ))}
        </div>
      ) : invitations.length > 0 ? (
        <div className="grid gap-4">
          {invitations.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} onActionComplete={fetchInvitations} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Inbox className="size-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No pending invitations</h3>
          <p className="text-muted-foreground max-w-sm">When someone invites you to a virtual date, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
