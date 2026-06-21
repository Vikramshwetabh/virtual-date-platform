import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { auth, users } from '@/lib/api';
import { toast } from 'sonner';
import { useRoomStore } from '@/components/onboarding/room-store';
import { useChatStore } from '@/components/onboarding/chat-store';
import { useNotificationStore } from '@/store/notification-store';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  isSessionExpired: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (credentials: any) => Promise<void>;
  logout: () => void;
  logoutCurrentSession: () => Promise<void>;
  logoutAllSessions: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  getSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setIsSessionExpired: (isExpired: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,
      isSessionExpired: false,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setIsSessionExpired: (isSessionExpired) => set({ isSessionExpired }),

      login: async (credentials) => {
        const { token, refresh_token } = await auth.login(credentials) as any;
        set({ token, refreshToken: refresh_token, isLoading: true, isSessionExpired: false });
      },

      signup: async (credentials) => {
        await auth.signup(credentials);
      },

      verifyEmail: async (token) => {
        await auth.verifyEmail({ token });
      },

      resendVerification: async (email) => {
        await auth.resendVerification({ email });
      },

      forgotPassword: async (email) => {
        await auth.forgotPassword({ email });
      },

      resetPassword: async (token, newPassword) => {
        await auth.resetPassword({ token, new_password: newPassword });
      },

      changePassword: async (oldPassword, newPassword) => {
        await auth.changePassword({ old_password: oldPassword, new_password: newPassword });
      },

      getSessions: async () => {
        return await auth.getSessions();
      },

      revokeSession: async (sessionId) => {
        await auth.revokeSession({ session_id: sessionId });
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true });
        try {
          if (get().token) {
            const user = await users.getMe();
            set({ user, isAuthenticated: true, isLoading: false });
            if (typeof window !== 'undefined') {
              localStorage.setItem('userId', user.id);
            }
          } else {
            throw { status: 401, message: "No token" };
          }
        } catch (error: any) {
          console.error("Failed to fetch user:", error);
          if (error?.status === 401 || error?.status === 403) {
            get().logout();
          } else {
            toast.error("Connection issue. Retrying...");
            set({ isLoading: false }); // keep token intact
          }
        }
      },

      logoutCurrentSession: async () => {
        try {
          const { refreshToken } = get();
          if (refreshToken) {
            await auth.logout({ refresh_token: refreshToken });
          }
        } catch (e) {
          console.error("Logout API failed", e);
        } finally {
          get().logout();
        }
      },

      logoutAllSessions: async () => {
        // Mock backend API call as no endpoint exists currently
        toast.success("Logged out from all sessions successfully.");
        get().logout();
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userId');
        }
        // Clean up other store states to prevent session leak
        useRoomStore.setState({ currentRoom: null, members: [], loading: false });
        useChatStore.getState().clearMessages();
        useNotificationStore.getState().clearNotifications();

        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false, isSessionExpired: false });
        toast.info("You have been logged out.");
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }), 
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
