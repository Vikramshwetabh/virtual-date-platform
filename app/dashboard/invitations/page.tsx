'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { invitations as apiInvitations } from '@/lib/api';
import { enrichInvitations } from '@/lib/invitation-utils';
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
    if (!user?.id) return;
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

      // Perform sender/receiver enrichment asynchronously based on user.id
      enrichInvitations(combinedList, user.id).then((enriched) => {
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
    if (user?.id) {
      loadInvitations();
    }
  }, [user?.id]);

  useEffect(() => {
    console.log("INVITATIONS_STATE", invitations);
  }, [invitations]);

  useEffect(() => {
    console.log("CURRENT_USER", user);
  }, [user]);

  const handleAccept = async (id: string) => {
    setActioningId(id);
    // Optimistic UI update
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'accepted' } : inv))
    );
    try {
      const res = await apiInvitations.accept(id);
      toast.success('Invitation accepted!');
      if (res?.roomId) {
        router.push(`/dashboard/date/${res.roomId}`);
      } else {
        await loadInvitations();
      }
    } catch (error: any) {
      // Revert on error
      setInvitations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'pending' } : inv))
      );
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    // Optimistic UI update
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'rejected' } : inv))
    );
    try {
      await apiInvitations.reject(id);
      toast.success('Invitation declined');
      await loadInvitations();
    } catch (error: any) {
      // Revert on error
      setInvitations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'pending' } : inv))
      );
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
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.1)]',
      accepted: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)]',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]',
    };

    const isPending = inv.status === 'pending';
    const isSentByMe = inv.senderId === user?.id;

    return (
      <Card key={inv.id} className="group overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1b1522]/50 via-card/30 to-[#120f1a]/80 shadow-lg hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 animate-fade-in-up">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/40 transition-colors shrink-0 shadow-md">
              <Avatar className="size-full rounded-none">
                <AvatarImage src={inv.sender?.avatar || undefined} alt={inv.sender?.name} className="object-cover" />
                <AvatarFallback>{inv.sender?.name?.charAt(0) || 'I'}</AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 space-y-1">
              <h4 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors">
                {isSentByMe ? `Sent to ${inv.sender?.name || 'Someone'}` : `Received from ${inv.sender?.name || 'Someone'}`}
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="size-3.5 text-accent" /> {dateStr}
                </span>
                <span className="flex items-center gap-1.5 capitalize font-semibold text-primary">
                  <MapPin className="size-3.5" /> {inv.environmentType} Date
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isPending ? (
              isSentByMe ? (
                <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 font-semibold shadow-[0_0_8px_rgba(234,179,8,0.1)] capitalize" variant="outline">
                  Awaiting response
                </Badge>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/10 hover:bg-white/5 hover:text-white rounded-xl h-9 px-3.5 font-semibold transition-all duration-200" 
                    onClick={() => handleReject(inv.id)} 
                    disabled={actioningId !== null}
                  >
                    <X className="size-4 mr-1" /> Decline
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-9 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/20 rounded-xl transition-all duration-200" 
                    onClick={() => handleAccept(inv.id)} 
                    disabled={actioningId !== null}
                  >
                    {actioningId === inv.id ? (
                      <span className="animate-spin mr-1">⏳</span>
                    ) : (
                      <Check className="size-4 mr-1" />
                    )}
                    Accept
                  </Button>
                </>
              )
            ) : (
              <Badge className={`capitalize shrink-0 border px-3 py-1 font-semibold ${statusColors[inv.status] || ''}`} variant="outline">
                {inv.status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-white">
          <Calendar className="size-8 text-primary animate-pulse" />
          Invitation History
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Track the status of all sent and received virtual date requests.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/20 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20 p-1.5 rounded-2xl border border-white/5 max-w-md [&>button[data-state=active]]:bg-gradient-to-r [&>button[data-state=active]]:from-primary [&>button[data-state=active]]:to-accent [&>button[data-state=active]]:text-primary-foreground">
            <TabsTrigger value="pending" className="rounded-xl font-semibold text-sm transition-all duration-300">Pending ({pendingList.length})</TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-xl font-semibold text-sm transition-all duration-300">Accepted ({acceptedList.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-xl font-semibold text-sm transition-all duration-300">Declined ({rejectedList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 outline-none">
            {pendingList.length > 0 ? (
              pendingList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-3xl bg-card/5">
                <Clock className="size-8 text-muted-foreground/60 mb-3 animate-float" />
                <h4 className="font-bold text-white text-lg">No pending requests</h4>
                <p className="text-sm text-muted-foreground/80 max-w-xs mt-1">Any pending date invitations will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4 outline-none">
            {acceptedList.length > 0 ? (
              acceptedList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-3xl bg-card/5">
                <Check className="size-8 text-muted-foreground/60 mb-3 animate-float" />
                <h4 className="font-bold text-white text-lg">No accepted invitations</h4>
                <p className="text-sm text-muted-foreground/80 max-w-xs mt-1">Accepted virtual date requests will list here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 outline-none">
            {rejectedList.length > 0 ? (
              rejectedList.map(renderInvitationCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-3xl bg-card/5">
                <X className="size-8 text-muted-foreground/60 mb-3 animate-float" />
                <h4 className="font-bold text-white text-lg">No declined invitations</h4>
                <p className="text-sm text-muted-foreground/80 max-w-xs mt-1">Declined requests will be shown here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
