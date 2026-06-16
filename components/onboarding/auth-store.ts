import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './index';
import { authService } from './auth.service';
import { userService } from './user.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        const response = await authService.login(credentials);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          loading: false,
        });
      },

      signup: async (data) => {
        set({ loading: true });
        const response = await authService.signup(data);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          loading: false,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchCurrentUser: async () => {
        if (!get().token) return;
        set({ loading: true });
        const user = await userService.getCurrentUser();
        set({ user, isAuthenticated: true, loading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Persist only the token
    }
  )
);