'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { invitations as apiInvitations } from '@/lib/api';
import { enrichInvitationsWithSenders } from '@/lib/invitation-utils';
import { useAuthStore } from '@/store/auth-store';
import { Calendar, Inbox, Check, X, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function InvitationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadInvitations = async () => {
    try {
      const pendingRes = await apiInvitations.getPending();
      console.log("INVITATIONS_API", pendingRes);

      const historyRes = await apiInvitations.getHistory();
      console.log("INVITATIONS_HISTORY", historyRes);

      const pendingList = pendingRes?.invitations ?? [];
      const historyList = Array.isArray(historyRes) ? historyRes : historyRes?.invitations || [];

      // Merge both datasets by invitation ID
      const combinedMap = new Map();
      pendingList.forEach((item: any) => combinedMap.set(item.id, item));
      historyList.forEach((item: any) => {
        if (!combinedMap.has(item.id)) {
          combinedMap.set(item.id, item);
        }
      });
      const combinedList = Array.from(combinedMap.values());

      // Render pending invitations immediately (without blocking on sender profiles)
      setInvitations(combinedList);

      // Perform sender enrichment asynchronously
      enrichInvitationsWithSenders(combinedList).then((enriched) => {
        setInvitations(enriched);
      }).catch((err) => {
        console.error("Enrichment failed:", err);
      });

    } catch (err: any) {
      toast.error(err.message || 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  useEffect(() => {
    console.log("INVITATIONS_STATE", invitations);
  }, [invitations]);

  useEffect(() => {
    console.log("CURRENT_USER", user);
  }, [user]);

  const handleAccept = async (id: string) => {
    setActioningId(id);
    try {
      const res = await apiInvitations.accept(id);
      toast.success('Invitation accepted!');
      await loadInvitations();
      if (res?.roomId) {
        router.push(`/dashboard/date/${res.roomId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await apiInvitations.reject(id);
      toast.success('Invitation declined');
      await loadInvitations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline invitation');
    } finally {
      setActioningId(null);
    }
  };

  const pendingList = invitations.filter((inv) => inv.status === 'pending');
  const acceptedList = invitations.filter((inv) => inv.status === 'accepted');
  const rejectedList = invitations.filter((inv) => inv.status === 'rejected');

  const renderInvitationCard = (inv: any) => {
    const dateStr = inv.createdAt 
      ? new Date(inv.createdAt).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      : 'Recent';

    const statusColors: any = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const isPending = inv.status === 'pending';

    return (
      <Card key={inv.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-colors">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="size-12 border border-border/50 shrink-0">
              <AvatarImage src={inv.sender?.avatar || undefined} alt={inv.sender?.name} />
              <AvatarFallback>{inv.sender?.name?.charAt(0) || 'I'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
              <h4 className="font-semibold text-base truncate">
                {inv.sender?.name || 'Someone'}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {dateStr}
                </span>
                <span className="flex items-center gap-1 capitalize">
                  <MapPin className="size-3.5" /> {inv.environmentType} Date
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isPending ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-9 px-3" 
                  onClick={() => handleReject(inv.id)} 
                  disabled={actioningId !== null}
                >
                  <X className="size-4 mr-1" /> Decline
                </Button>
                <Button 
                  size="sm" 
                  className="h-9 px-4 shadow-md shadow-primary/20" 
                  onClick={() => handleAccept(inv.id)} 
                  disabled={actioningId !== null}
                >
                  <Check className="size-4 mr-1" /> Accept
                </Button>
              </>
            ) : (
              <Badge className={`capitalize shrink-0 border ${statusColors[inv.status] || ''}`} variant="outline">
                {inv.status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Calendar className="size-8 text-primary" />
          Invitation History
        </h1>
        <p className="text-muted-foreground text-lg">
          Track the status of all sent and received virtual date requests.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/40 backdrop-blur-sm max-w-md">
            <TabsTrigger value="pending">Pending ({pendingList.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedList.length})</TabsTrigger>
            <TabsTrigger value="rejected">Declined ({rejectedList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 outline-none">
            {pendingList.length > 0 ? (
              pendingList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/50 rounded-2xl bg-card/5">
                <Clock className="size-8 text-muted-foreground mb-3" />
                <h4 className="font-semibold text-lg">No pending requests</h4>
                <p className="text-sm text-muted-foreground">Any pending date invitations will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4 outline-none">
            {acceptedList.length > 0 ? (
              acceptedList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/50 rounded-2xl bg-card/5">
                <Check className="size-8 text-muted-foreground mb-3" />
                <h4 className="font-semibold text-lg">No accepted invitations</h4>
                <p className="text-sm text-muted-foreground">Accepted virtual date requests will list here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 outline-none">
            {rejectedList.length > 0 ? (
              rejectedList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/50 rounded-2xl bg-card/5">
                <X className="size-8 text-muted-foreground mb-3" />
                <h4 className="font-semibold text-lg">No declined invitations</h4>
                <p className="text-sm text-muted-foreground">Declined requests will be shown here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
