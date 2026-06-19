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
    <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all duration-200 animate-fade-in-up">
      <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border-2 border-primary/20 shrink-0 overflow-hidden relative shadow-md">
             {senderAvatar ? (
               <img src={senderAvatar} alt={senderName} className="object-cover w-full h-full" />
             ) : (
               <span className="text-primary font-bold font-heading text-xl">
                 {senderName?.charAt(0) || '?'}
               </span>
             )}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
              {senderName}
            </h4>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground/80 gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="size-3.5 text-accent" />
                {dateCreated}
              </span>
              <span className="flex items-center gap-1.5 capitalize font-semibold text-primary">
                <MapPin className="size-3.5" />
                {invitation.environmentType} Date
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="border-border hover:bg-foreground/5 hover:text-foreground rounded-xl h-10 px-4 font-semibold transition-all duration-200" onClick={handleReject} disabled={isLoading}>
            <X className="size-4 mr-1.5" /> Decline
          </Button>
          <Button size="sm" className="h-10 px-5 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-200" onClick={handleAccept} disabled={isLoading}>
            <Check className="size-4 mr-1.5" /> Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
