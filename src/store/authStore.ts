/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';   // your axios instance

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMPANY';
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/sign-in/email', { email, password });

          const userData: User = {
            id: res.data.user?.id || res.data.id,
            name: res.data.user?.name || res.data.name,
            email: res.data.user?.email || res.data.email,
            role: res.data.user?.role || res.data.role || 'COMPANY',
          };

          set({ user: userData, isAuthenticated: true, error: null });
          return userData;
        } catch (err: any) {
          const message = err.response?.data?.error || 'Invalid credentials';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/sign-out');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) { /* empty */ }
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const res = await api.get('/api/auth/session');
          if (res.data?.user) {
            const u = res.data.user;
            set({
              user: {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role || 'COMPANY',
              },
              isAuthenticated: true,
            });
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'safehire-auth' }
  )
);