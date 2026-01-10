import { handleServerError } from "@/lib/handle-server-error";
import { router } from "@/main";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (import.meta.env.DEV) {
            console.log({ failureCount, error });
          }

          if (failureCount >= 0 && import.meta.env.DEV) {
            return false;
          }
          if (failureCount > 3 && import.meta.env.PROD) {
            return false;
          }

          return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
        },
        refetchOnWindowFocus: import.meta.env.PROD,
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
            // TODO: 사용자 정보 리셋
            // // useAuthStore.getState().auth.reset();
            const redirect = `${router.history.location.href}`;
            router.navigate({ to: "/sign-in", search: { redirect } });
          }
          if (error.response?.status === 500) {
            toast.error("Internal Server Error!");
            // Only navigate to error page in production to avoid disrupting HMR in development
            if (import.meta.env.PROD) {
              router.navigate({ to: "/500" });
            }
          }
          if (error.response?.status === 403) {
            router.navigate("/forbidden", { replace: true });
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
