import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (jwt: string, refresh: string) => void;
  clearTokens: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (jwt, refresh) =>
        set({
          token: jwt,
          refreshToken: refresh,
          isAuthenticated: true,
        }),

      clearTokens: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // saves to localStorage
    }
  )
);
