import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { auth, users } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        const { token } = await auth.login(credentials);
        set({ token, isLoading: true });
      },

      signup: async (credentials) => {
        await auth.signup(credentials);
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

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userId');
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        toast.info("You have been logged out.");
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), 
    }
  )
);
