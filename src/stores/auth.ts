import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (accessToken, refreshToken) => {
        localStorage.setItem('auth-token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);
        set({ isAuthenticated: true });
        await get().fetchProfile();
      },
      
      logout: () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        set({ user: null, isAuthenticated: false });
      },
      
      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/users/profile/');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
);
