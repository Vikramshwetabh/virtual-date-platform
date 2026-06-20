'use client';

import { useCallback, useEffect, useRef } from 'react';
import { invitations as apiInvitations, users as apiUsers, rooms as apiRooms } from '@/lib/api';
import { enrichInvitations } from '@/lib/invitation-utils';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { useWebSocket } from '@/hooks/use-websocket';
import { toast } from 'sonner';

const POLL_INTERVAL_MS = 15000;

export function GlobalSocketListener() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // Reference lists to avoid notification duplicates
  const knownInvitationStates = useRef<Map<string, string>>(new Map()); // id -> status
  const knownMatchIds = useRef<Set<string>>(new Set());
  const knownRoomIds = useRef<Set<string>>(new Set());
  const isInitialized = useRef(false);

  // Global websocket listener
  const { messages } = useWebSocket();

  // Handle incoming websocket events
  useEffect(() => {
    if (!messages.length) return;
    const latestMsg = messages[messages.length - 1];
    const type = latestMsg?.type || latestMsg?.event_type;

    if (!type || !isInitialized.current) return;

    if (type === 'invitation_received') {
      const payload = latestMsg.payload;
      toast.info('New Invitation', {
        description: `${payload?.senderName || 'Someone'} sent you a virtual date request!`,
      });
      addNotification({
        type: 'invitation_received',
        title: 'New Date Invitation',
        description: `${payload?.senderName || 'Someone'} invited you to a virtual date.`,
        link: '/dashboard/invitations',
      });
    } else if (type === 'invitation_accepted') {
      const payload = latestMsg.payload;
      toast.success('Invitation Accepted!', {
        description: `${payload?.receiverName || 'Someone'} accepted your date request!`,
      });
      addNotification({
        type: 'invitation_accepted',
        title: 'Invitation Accepted!',
        description: `${payload?.receiverName || 'Someone'} accepted your date request.`,
        link: payload?.roomId ? `/dashboard/date/${payload.roomId}` : '/dashboard/rooms',
      });
    } else if (type === 'match_created') {
      const payload = latestMsg.payload;
      toast.success('New Match! 💖', {
        description: `You and ${payload?.name || 'Someone'} matched!`,
      });
      addNotification({
        type: 'match_created',
        title: 'Mutual Match Created!',
        description: `You matched with ${payload?.name || 'Someone'}.`,
        link: '/dashboard/my-matches',
      });
    } else if (type === 'room_created') {
      const payload = latestMsg.payload;
      addNotification({
        type: 'room_created',
        title: 'Virtual Room Ready',
        description: 'Your virtual dating room has been created.',
        link: payload?.roomId ? `/dashboard/date/${payload.roomId}` : '/dashboard/rooms',
      });
    }
  }, [messages, addNotification]);

  // Comparison poll functions
  const performStateCheck = useCallback(async () => {
    if (!user?.id) return;

    try {
      // 1. Check Invitations (Pending & History)
      const [pendingRes, historyRes, matchesRes, roomsRes] = await Promise.all([
        apiInvitations.getPending().catch(() => ({ invitations: [] })),
        apiInvitations.getHistory().catch(() => []),
        apiUsers.getMatches().catch(() => []),
        apiRooms.list().catch(() => ({ rooms: [] })),
      ]);

      const pendingList = pendingRes?.invitations ?? [];
      const historyList = Array.isArray(historyRes) ? historyRes : historyRes?.invitations || [];

      // Merge invitations
      const combinedMap = new Map();
      pendingList.forEach((item: any) => combinedMap.set(item.id, item));
      historyList.forEach((item: any) => {
        if (!combinedMap.has(item.id)) combinedMap.set(item.id, item);
      });
      const invitationsList = Array.from(combinedMap.values());
      const enrichedList = await enrichInvitations(invitationsList, user.id);

      // Matches List
      const matchesList = Array.isArray(matchesRes) ? matchesRes : matchesRes?.matches || [];

      // Rooms List
      const roomsList = Array.isArray(roomsRes) ? roomsRes : roomsRes?.rooms || [];

      if (!isInitialized.current) {
        // Just populate initial state without alerting
        enrichedList.forEach((inv) => knownInvitationStates.current.set(inv.id, inv.status));
        matchesList.forEach((m: any) => knownMatchIds.current.add(m.id));
        roomsList.forEach((r: any) => {
          if (r.status === 'active') knownRoomIds.current.add(r.id);
        });
        isInitialized.current = true;
        return;
      }

      // Check for invitation alerts
      for (const inv of enrichedList) {
        const lastStatus = knownInvitationStates.current.get(inv.id);

        if (!lastStatus) {
          // New invitation
          knownInvitationStates.current.set(inv.id, inv.status);
          if (inv.status === 'pending' && inv.receiverId === user.id) {
            toast.info('New Invitation', {
              description: `${inv.sender?.name || 'Someone'} sent you a virtual date request!`,
            });
            addNotification({
              type: 'invitation_received',
              title: 'New Date Invitation',
              description: `${inv.sender?.name || 'Someone'} invited you to a virtual date.`,
              link: '/dashboard/invitations',
            });
          }
        } else if (lastStatus !== inv.status) {
          // Status change (accepted/rejected)
          knownInvitationStates.current.set(inv.id, inv.status);
          if (inv.status === 'accepted' && inv.senderId === user.id) {
            toast.success('Invitation Accepted! 💖', {
              description: `${inv.sender?.name || 'Someone'} accepted your date request!`,
            });
            addNotification({
              type: 'invitation_accepted',
              title: 'Invitation Accepted!',
              description: `${inv.sender?.name || 'Someone'} accepted your date request.`,
              link: inv.roomId ? `/dashboard/date/${inv.roomId}` : '/dashboard/rooms',
            });
          }
        }
      }

      // Check for matches alerts
      for (const match of matchesList) {
        if (!knownMatchIds.current.has(match.id)) {
          knownMatchIds.current.add(match.id);
          toast.success('New Match! 💕', {
            description: `You matched with ${match.name}!`,
          });
          addNotification({
            type: 'match_created',
            title: 'Mutual Match Created!',
            description: `You matched with ${match.name}.`,
            link: '/dashboard/my-matches',
          });
        }
      }

      // Check for room alerts
      for (const room of roomsList) {
        if (room.status === 'active' && !knownRoomIds.current.has(room.id)) {
          knownRoomIds.current.add(room.id);
          addNotification({
            type: 'room_created',
            title: 'Virtual Room Ready',
            description: 'Your virtual dating room has been created.',
            link: `/dashboard/date/${room.id}`,
          });
        }
      }

    } catch (err) {
      console.error('Failed to poll states', err);
    }
  }, [user, addNotification]);

  useEffect(() => {
    if (!user?.id) return;
    performStateCheck();
    const interval = setInterval(performStateCheck, POLL_INTERVAL_MS);

    const handleFocus = () => {
      performStateCheck();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, performStateCheck]);

  return null;
}
