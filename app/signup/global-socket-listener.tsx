'use client';

import { useCallback, useEffect, useRef } from 'react';
import { invitations as apiInvitations } from '@/lib/api';
import { enrichInvitationsWithSenders } from '@/lib/invitation-utils';
import { toast } from 'sonner';

const POLL_INTERVAL_MS = 15000;

export function GlobalSocketListener() {
  const knownInvitationIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const pollInvitations = useCallback(async () => {
    try {
      const data = await apiInvitations.getPending();
      const pending = data.invitations ?? [];
      const enriched = await enrichInvitationsWithSenders(pending);

      if (!initialized.current) {
        enriched.forEach((invitation) => knownInvitationIds.current.add(invitation.id));
        initialized.current = true;
        return;
      }

      for (const invitation of enriched) {
        if (!knownInvitationIds.current.has(invitation.id)) {
          knownInvitationIds.current.add(invitation.id);
          toast.info('New Date Invitation', {
            description: `${invitation.sender?.name || 'Someone'} invited you to a virtual date.`,
          });
        }
      }

      knownInvitationIds.current = new Set(enriched.map((invitation) => invitation.id));
    } catch {
      // Ignore polling errors; pages fetch their own data.
    }
  }, []);

  useEffect(() => {
    pollInvitations();
    const interval = setInterval(pollInvitations, POLL_INTERVAL_MS);

    const handleFocus = () => {
      pollInvitations();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pollInvitations]);

  return null;
}
