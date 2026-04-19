import { create } from "zustand";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  resetAccessToken: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN_KEY);
  const initToken = cookieState ? JSON.parse(cookieState) : null;

  const clearTokens = () => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  };

  return {
    user: null,
    setUser: (user) => set({ user }),
    accessToken: initToken,
    setAccessToken: (accessToken) => {
      setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken));
      set({ accessToken });
    },
    resetAccessToken: () => {
      clearTokens();
      set({ accessToken: null });
    },
    reset: () => {
      clearTokens();
      set({ user: null, accessToken: null });
    },
  };
});
