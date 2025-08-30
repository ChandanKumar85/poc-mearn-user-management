import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../api/authApi';
import type { JwtPayload } from '../api/models/auth.interface';

interface AuthState {
  token: string | null;
  setTokens: (jwt: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      setTokens: (jwt) => {
        const decoded = jwtDecode<JwtPayload>(jwt);
        const expiresInMs = decoded.exp * 1000 - Date.now();

        setTimeout(async () => {
          try {
            await logoutUser({ activeId: decoded.activeId });
          } catch (error) {
            console.error('Auto-logout failed:', error);
          }
          set({ token: null });
        }, expiresInMs);

        set({ token: jwt });
      },

      clearTokens: async () => {
        const token = get().token;
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          try {
            await logoutUser({ activeId: decoded.activeId });
          } catch (error) {
            console.error('Logout failed:', error);
          }
        }
        set({ token: null });
      },
    }),
    {
      name: 'authStorage',
    }
  )
);
