'use client';

import { useEffect, useState } from 'react';
import { rooms } from '@/lib/api';
import { Sparkles, Calendar, ArrowRight, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RoomsPage() {
  const [roomList, setRoomList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await rooms.list();
        const list = Array.isArray(res) ? res : res?.rooms || [];
        setRoomList(list);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load rooms');
      } finally {
        setIsLoading(false);
      }
    }
    loadRooms();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Sparkles className="size-8 text-primary" />
          Active Rooms
        </h1>
        <p className="text-muted-foreground text-lg">
          Your current active dating rooms. Enter to join your date.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card/40 animate-pulse rounded-xl border border-border/50" />
          ))}
        </div>
      ) : roomList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {roomList.map((room) => {
            const dateStr = room.createdAt 
              ? new Date(room.createdAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : 'Unknown';

            return (
              <Card key={room.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg capitalize">{room.roomType || 'Virtual'} Room</h3>
                      <p className="text-xs text-muted-foreground">Created: {dateStr}</p>
                    </div>
                    <Badge variant={room.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {room.status || 'Active'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <span className="text-sm text-muted-foreground">
                      {room.members?.length || 0} participants
                    </span>
                    <Link href={`/dashboard/date/${room.id}`} passHref>
                      <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
                        <Play className="size-4 fill-white" /> Join Date
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="size-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No active rooms</h3>
          <p className="text-muted-foreground max-w-sm">When an invitation is accepted, an active virtual date room will be created here.</p>
        </div>
      )}
    </div>
  );
}
