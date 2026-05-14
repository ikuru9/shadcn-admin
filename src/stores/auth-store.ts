import { create } from "zustand";

import { authUserQueryKey } from "@/constants/client-query-key";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { clearQueryClientCache, getQueryClient } from "@/context/tanstack-query/query-client-store";
import { getMyMenusQueryOptions } from "@/gen/hooks";
import type { User } from "@/gen/types";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

const MENU_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
let menuRefreshTimer: ReturnType<typeof setInterval> | null = null;
let menuRefreshInFlight = false;

interface AuthState {
  accessToken: string | null;
  setAccessToken: (data: { accessToken: string; refreshToken: string; user: User }) => Promise<void>;
  resetAccessToken: () => void;
  reset: () => void;
}

function stopMenuRefreshTimer() {
  if (menuRefreshTimer !== null) {
    clearInterval(menuRefreshTimer);
    menuRefreshTimer = null;
  }

  menuRefreshInFlight = false;
}

async function refreshMenus() {
  const queryClient = getQueryClient();

  if (!queryClient || menuRefreshInFlight) {
    return;
  }

  menuRefreshInFlight = true;

  try {
    await queryClient.ensureQueryData({
      ...getMyMenusQueryOptions(),
      staleTime: 0,
    });
  } finally {
    menuRefreshInFlight = false;
  }
}

function startMenuRefreshTimer() {
  stopMenuRefreshTimer();

  menuRefreshTimer = setInterval(() => {
    void refreshMenus();
  }, MENU_REFRESH_INTERVAL_MS);
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN_KEY);
  let initToken: string | null = null;

  if (cookieState) {
    try {
      initToken = JSON.parse(cookieState) as string;
    } catch {
      initToken = cookieState;
    }
  }

  function clearTokens() {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }

  return {
    accessToken: initToken,
    setAccessToken: async ({ accessToken, refreshToken, user }) => {
      setCookie(ACCESS_TOKEN_KEY, accessToken);
      setCookie(REFRESH_TOKEN_KEY, refreshToken);
      set({ accessToken });

      const queryClient = getQueryClient();
      queryClient?.setQueryData(authUserQueryKey, user);

      try {
        await refreshMenus();
      } catch {
        // Keep the login flow alive even if menu preloading fails.
      }

      startMenuRefreshTimer();
    },
    resetAccessToken: () => {
      clearTokens();
      stopMenuRefreshTimer();
      set({ accessToken: null });
    },
    reset: () => {
      clearTokens();
      stopMenuRefreshTimer();
      set({ accessToken: null });
      clearQueryClientCache();
    },
  };
});
