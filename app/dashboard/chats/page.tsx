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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <MessageCircleHeart className="size-8 text-primary" />
          My Chats
        </h1>
        <p className="text-muted-foreground text-lg">
          Your active chat histories and messaging threads.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : conversations.length > 0 ? (
        <div className="grid gap-4">
          {conversations.map((convo) => {
            const dateStr = convo.lastActivity 
              ? new Date(convo.lastActivity).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : 'Recent';

            return (
              <Card key={convo.id || convo.roomId} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar className="size-12 border border-border/50">
                      <AvatarImage src={convo.participant?.avatar || undefined} alt={convo.participant?.name} />
                      <AvatarFallback>{convo.participant?.name?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{convo.participant?.name || 'Partner'}</span>
                        <span className="text-xs text-muted-foreground">• {dateStr}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {convo.lastMessage || 'Click to send a message...'}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/date/${convo.roomId}`} passHref>
                    <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10 shrink-0">
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircleHeart className="size-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground max-w-sm">When you match and message someone, your conversations will show up here.</p>
        </div>
      )}
    </div>
  );
}
