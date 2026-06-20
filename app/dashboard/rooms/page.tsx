'use client';

import { useEffect, useState } from 'react';
import { rooms } from '@/lib/api';
import { Video, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/dashboard/empty-state';
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight flex items-center gap-3 text-white">
          <Video className="size-8 text-primary animate-pulse" />
          Active Rooms
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Your current active dating rooms. Enter to join your date.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 w-full bg-card/20 animate-pulse rounded-[2rem] border border-white/5" />
          ))}
        </div>
      ) : roomList.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {roomList.map((room) => {
            const dateStr = room.createdAt 
              ? new Date(room.createdAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : 'Unknown';

            const isActive = room.status === 'active';

            return (
              <Card key={room.id} className="group overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#1b1522]/50 via-card/30 to-[#120f1a]/80 shadow-lg hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
                <CardContent className="p-6 flex flex-col justify-between h-full gap-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-lg capitalize">{room.roomType || 'Virtual'} Date Room</h3>
                      <p className="text-xs text-muted-foreground/80 mt-0.5">Created: {dateStr}</p>
                    </div>
                    <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20 capitalize shadow-[0_0_8px_rgba(34,197,94,0.15)] font-semibold' : 'capitalize'}>
                      {room.status || 'Active'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-auto border-t border-white/5 pt-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {room.members?.length || 0} participants
                    </span>
                    <Link href={`/dashboard/date/${room.id}`} passHref>
                      <Button size="sm" className="h-10 px-5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/20 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                        <Play className="size-4 fill-white mr-1.5" /> Join Date
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No active rooms"
          description="When an invitation is accepted, an active virtual date room will be created here."
          actionText="View Invitations"
          actionHref="/dashboard/invitations"
        />
      )}
    </div>
  );
}
