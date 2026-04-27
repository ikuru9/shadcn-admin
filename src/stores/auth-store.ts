import { create } from "zustand";

import { authUserQueryKey } from "@/constants/client-query-key";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { clearQueryClientCache, getQueryClient } from "@/context/tanstack-query/query-client-store";
import { getMyMenusQueryOptions } from "@/gen/hooks";
import type { User } from "@/gen/types";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (data: { accessToken: string; refreshToken: string; user: User }) => Promise<void>;
  resetAccessToken: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN_KEY);
  const initToken = cookieState ? JSON.parse(cookieState) : null;

  function clearTokens() {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }

  return {
    accessToken: initToken,
    setAccessToken: async ({ accessToken, refreshToken, user }) => {
      setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken));
      setCookie(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
      set({ accessToken });

      const queryClient = getQueryClient();
      queryClient?.setQueryData(authUserQueryKey, user);

      await queryClient?.ensureQueryData(getMyMenusQueryOptions());
    },
    resetAccessToken: () => {
      clearTokens();
      set({ accessToken: null });
    },
    reset: () => {
      clearTokens();
      set({ accessToken: null });
      clearQueryClientCache();
    },
  };
});
