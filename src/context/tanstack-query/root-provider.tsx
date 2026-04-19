import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { env } from "@/config/env";
import { handleServerError } from "@/lib/handle-server-error";
import { router } from "@/main";
import { useAuthStore } from "@/stores/auth-store";

// biome-ignore lint/style/useComponentExportOnlyModules: getContext
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (env.DEV) {
            console.log({ failureCount, error });
            if (failureCount >= 0) {
              return false;
            }
          } else if (failureCount > 3 && env.PROD) {
            return false;
          }

          return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
        },
        refetchOnWindowFocus: env.PROD,
        staleTime: 10 * 1000, // 10s
      },
      mutations: {
        onError: (error) => {
          handleServerError(error);

          if (error instanceof AxiosError) {
            if (error.response?.status === 304) {
              toast.error("Content not modified!");
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Session expired!");
            useAuthStore.getState().reset();
            const redirect = router.history.location.href ? `${router.history.location.href}` : undefined;
            router.navigate({ to: "/sign-in", search: { redirect } });
          }
          if (error.response?.status === 500) {
            toast.error("Internal Server Error!");
            // Only navigate to error page in production to avoid disrupting HMR in development
            if (env.PROD) {
              router.navigate({ to: "/500" });
            }
          }
          if (error.response?.status === 403) {
            router.navigate({ to: "/403", replace: true });
          }
        }
      },
    }),
  });

  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: React.PropsWithChildren<{
  queryClient: QueryClient;
}>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
