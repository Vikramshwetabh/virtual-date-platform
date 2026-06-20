import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

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
