'use client';

import { useEffect, useState } from 'react';
import { rooms } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export function ActiveRoomBanner() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveRoomId(null);
      return;
    }
    
    // Check if the user is currently already on the date room page
    if (pathname.includes('/dashboard/date/')) {
      setActiveRoomId(null);
      return;
    }

    async function checkActiveRooms() {
      try {
        const res = await rooms.list();
        const list = Array.isArray(res) ? res : res?.rooms || [];
        const active = list.find((r: any) => r.status === 'active');
        if (active) {
          setActiveRoomId(active.id);
        } else {
          setActiveRoomId(null);
        }
      } catch (err) {
        console.error("Failed to check active rooms", err);
      }
    }

    checkActiveRooms();
    const interval = setInterval(checkActiveRooms, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [pathname, user]);

  if (!activeRoomId) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary text-white py-2.5 px-4 flex items-center justify-between gap-3 shadow-md border-b border-primary/20 backdrop-blur-md animate-fade-in-down shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex size-2 animate-pulse rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
        <Video className="size-4 shrink-0 text-green-300" />
        <p className="text-xs font-bold tracking-tight truncate">
          You have an active virtual date in progress!
        </p>
      </div>
      <Link href={`/dashboard/date/${activeRoomId}`} passHref>
        <Button size="xs" className="bg-white text-primary hover:bg-white/90 font-extrabold rounded-lg px-3 py-1 shadow-sm shrink-0 transition-transform active:scale-95 text-[11px] gap-1">
          Return to Date <ArrowRight className="size-3" />
        </Button>
      </Link>
    </div>
  );
}
