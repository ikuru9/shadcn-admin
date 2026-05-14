import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";

import { getMyMenuPermissionsQueryOptions } from "@/gen/hooks";
import { useAuthStore } from "@/stores/auth-store";

function getErrorStatus(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }

  return undefined;
}

export function createAuthenticatedBeforeLoad(menuKey?: string) {
  return async ({ context, location }: { context: { queryClient: QueryClient }; location: { href: string } }) => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });
    }

    if (!menuKey) {
      return;
    }

    try {
      await context.queryClient.ensureQueryData({
        ...getMyMenuPermissionsQueryOptions({ menuKey }),
        staleTime: 0,
      });
    } catch (error) {
      const status = getErrorStatus(error);

      if (status === 403) {
        throw redirect({
          to: "/403",
          replace: true,
        });
      }

      if (status === 401) {
        throw redirect({
          to: "/sign-in",
          search: { redirect: location.href },
          replace: true,
        });
      }

      throw error;
    }
  };
}
