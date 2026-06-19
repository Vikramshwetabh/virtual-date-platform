'use client';

import { useEffect, useState } from 'react';
import { chat } from '@/lib/api';
import { MessageCircleHeart, Send, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ChatsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await chat.getConversations();
        const list = Array.isArray(res) ? res : res?.conversations || [];
        setConversations(list);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    }
    loadConversations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-foreground">
          <MessageCircleHeart className="size-8 text-primary" />
          My Chats
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Your active chat histories and messaging threads.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/50 animate-pulse rounded-2xl border border-border" />
          ))}
        </div>
      ) : conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map((convo) => {
            const dateStr = convo.lastActivity 
              ? new Date(convo.lastActivity).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : 'Recent';

            return (
              <Card key={convo.id || convo.roomId} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative size-12 rounded-2xl overflow-hidden border border-border group-hover:border-primary/40 transition-colors shrink-0 shadow-md">
                      <Avatar className="size-full rounded-none">
                        <AvatarImage src={convo.participant?.avatar || undefined} alt={convo.participant?.name} className="object-cover" />
                        <AvatarFallback>{convo.participant?.name?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-foreground text-base md:text-lg group-hover:text-primary transition-colors">{convo.participant?.name || 'Partner'}</span>
                        <span className="text-xs text-muted-foreground/80 font-medium">{dateStr}</span>
                      </div>
                      <p className="text-sm text-muted-foreground/90 truncate max-w-xs md:max-w-md">
                        {convo.lastMessage || 'Click to send a message...'}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/date/${convo.roomId}`} passHref>
                    <Button variant="ghost" size="icon" className="rounded-xl size-10 bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-200 shrink-0 shadow-sm">
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-border rounded-3xl bg-card shadow-sm max-w-md mx-auto">
          <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
            <MessageCircleHeart className="size-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No conversations yet</h3>
          <p className="text-muted-foreground/90 max-w-sm text-sm mb-6">
            When you match and message someone, your active conversations will show up here. Let's find your first match!
          </p>
          <Link href="/dashboard/discover" passHref>
            <Button className="h-10 px-5 bg-primary text-primary-foreground font-semibold rounded-xl transition-all duration-200">
              Find Connections
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
