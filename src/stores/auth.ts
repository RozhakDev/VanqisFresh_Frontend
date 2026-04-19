import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /**
   * Menyimpan data pengguna ke state autentikasi.
   */
  setUser: (user: User | null) => void;
  /**
   * Menyimpan token autentikasi dan memuat profil pengguna.
   */
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  /**
   * Menghapus status autentikasi serta token lokal.
   */
  logout: () => void;
  /**
   * Mengambil data profil terbaru dari server.
   */
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      /**
       * Menyinkronkan objek pengguna ke state lokal.
       */
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      /**
       * Menyimpan token lalu memuat profil pengguna aktif.
       */
      login: async (accessToken, refreshToken) => {
        localStorage.setItem('auth-token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);
        set({ isAuthenticated: true });
        await get().fetchProfile();
      },
      
      /**
       * Menghapus token dan mereset status autentikasi.
       */
      logout: () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        set({ user: null, isAuthenticated: false });
      },
      
      /**
       * Memuat profil dari endpoint pengguna saat ini.
       */
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
      /**
       * Menyimpan hanya state yang diperlukan untuk pemulihan sesi.
       */
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
);
