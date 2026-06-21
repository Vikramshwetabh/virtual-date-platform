import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { notifications as notificationsApi } from '@/lib/api';

export interface NotificationItem {
  id: string;
  type: 'invitation_received' | 'invitation_accepted' | 'match_created' | 'room_created';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  isLoading: boolean;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      isLoading: false,

      fetchNotifications: async () => {
        set({ isLoading: true });
        try {
          const data = await notificationsApi.get();
          
          const mapped: NotificationItem[] = data.map((n: any) => {
            let title = n.event_type;
            let description = '';
            let link = '';
            
            try {
              if (n.event_type === 'invitation_received') {
                title = 'New Date Invitation';
                description = `You have a new invitation to a ${n.payload?.environment_type || 'virtual'} date.`;
                link = '/dashboard/invitations';
              } else if (n.event_type === 'match_created') {
                title = 'New Match';
                description = `You matched with someone!`;
                link = '/dashboard/my-matches';
              } else if (n.event_type === 'room_created') {
                title = 'Room Ready';
                description = `Your virtual date room is ready.`;
                link = `/dashboard/rooms`;
              }
            } catch(e) {}

            return {
              id: n.id,
              type: n.event_type as NotificationItem['type'],
              title,
              description,
              timestamp: n.created_at,
              read: n.read,
              link
            };
          });
          
          set({ notifications: mapped, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
          set({ isLoading: false });
        }
      },

      addNotification: (notification) => {
        const newItem: NotificationItem = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newItem, ...state.notifications].slice(0, 100), // Cap at 100 notifications
        }));
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
