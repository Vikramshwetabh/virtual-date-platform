'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { invitations as apiInvitations } from '@/lib/api';
import type { EnrichedInvitation } from '@/lib/types/api';
import { toast } from 'sonner';

interface InvitationCardProps {
  invitation: EnrichedInvitation;
  onActionComplete: () => void;
}

export function InvitationCard({ invitation, onActionComplete }: InvitationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await apiInvitations.accept(invitation.id);
      toast.success('Invitation accepted!');
      onActionComplete();

      if (res?.roomId) {
        router.push(`/dashboard/date/${res.roomId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await apiInvitations.reject(invitation.id);
      toast.success('Invitation declined');
      onActionComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const dateCreated = new Date(invitation.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const senderName = invitation.sender?.name || 'Someone';
  const senderAvatar = invitation.sender?.avatar;

  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 transition-colors hover:border-primary/40">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden relative">
             {senderAvatar ? (
               <img src={senderAvatar} alt={senderName} className="object-cover w-full h-full" />
             ) : (
               <span className="text-primary font-semibold font-heading text-lg">
                 {senderName?.charAt(0) || '?'}
               </span>
             )}
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground text-lg">
              {senderName}
            </h4>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 mt-1">
              <span className="flex items-center gap-1.5 opacity-80">
                <Clock className="size-3.5" />
                {dateCreated}
              </span>
              <span className="flex items-center gap-1.5 capitalize">
                <MapPin className="size-3.5" />
                {invitation.environmentType} date
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-10 px-4" onClick={handleReject} disabled={isLoading}>
            <X className="size-4 mr-1.5" /> Decline
          </Button>
          <Button size="sm" className="h-10 px-6 shadow-md shadow-primary/20" onClick={handleAccept} disabled={isLoading}>
            <Check className="size-4 mr-1.5" /> Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
