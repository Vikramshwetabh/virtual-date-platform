'use client';

import { useEffect } from 'react';
import { useSocket } from '@/components/onboarding/useSocket';
import { socketClient } from '@/components/onboarding/socket';
import { toast } from 'sonner';

export function GlobalSocketListener() {
  // Connect to the socket globally while authenticated
  useSocket();

  useEffect(() => {
    const handleReceived = (data: any) => {
      toast.info('New Date Invitation', {
        description: 'You just received a new virtual date invitation!',
      });
    };

    const handleAccepted = (data: any) => {
      toast.success('Invitation Accepted', {
        description: 'Your virtual date invitation was accepted!',
      });
    };

    socketClient.on('invitation_received', handleReceived);
    socketClient.on('invitation_accepted', handleAccepted);

    return () => {
      socketClient.off('invitation_received', handleReceived);
      socketClient.off('invitation_accepted', handleAccepted);
    };
  }, []);

  return null;
}