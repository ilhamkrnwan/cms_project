import { create } from 'zustand';
import { authApi } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  emailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.getSession();
      if (res.success && res.data?.user) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
    } catch {}
    set({ user: null, isAuthenticated: false, isLoading: false });
    return false;
  },

  logout: async () => {
    try {
      await authApi.signOut();
    } catch {}
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: Boolean(user) });
  }
}));
