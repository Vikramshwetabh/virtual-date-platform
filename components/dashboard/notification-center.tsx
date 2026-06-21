'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from '@/store/notification-store';
import { useAuthStore } from '@/store/auth-store';
import { EmptyNotifications } from '@/components/dashboard/empty-notifications';
import { Bell, Heart, Calendar, Video, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NotificationCenter() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fetch notifications on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when path changes or clicking outside
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'invitation_received':
      case 'invitation_accepted':
        return <Calendar className="size-4 text-accent" />;
      case 'match_created':
        return <Heart className="size-4 text-primary fill-primary/10" />;
      case 'room_created':
        return <Video className="size-4 text-green-400" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'invitation_received':
        return 'bg-accent/15 border-accent/20 text-accent';
      case 'invitation_accepted':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'match_created':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'room_created':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      default:
        return 'bg-secondary border-border text-muted-foreground';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative size-10 rounded-xl hover:bg-foreground/5 hover:text-foreground text-muted-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications center"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-[9px] font-extrabold text-white shadow-md border border-[#120f1a] animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-white/5 bg-[#1b1522]/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 p-4 bg-black/20">
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-sm font-bold text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/25 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white"
                  title="Mark all as read"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-destructive"
                  title="Clear all"
                  onClick={clearNotifications}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 transition-colors flex gap-3.5 items-start ${
                    item.read ? 'hover:bg-white/5 opacity-70' : 'bg-primary/5 hover:bg-primary/10'
                  }`}
                >
                  <div className={`size-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${getBadgeColor(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <p className={`text-xs font-bold truncate ${item.read ? 'text-white/80' : 'text-white'}`}>
                        {item.title}
                      </p>
                      <span className="text-[9px] text-muted-foreground/60 shrink-0 font-medium font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-normal break-words">
                      {item.description}
                    </p>
                    {item.link && (
                      <Link href={item.link} className="inline-flex items-center text-[10px] font-bold text-primary hover:text-accent hover:underline mt-1.5 transition-colors">
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyNotifications />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
