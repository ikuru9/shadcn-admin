import { useEffect } from "react";

import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Dialoger } from "@/components/dialogs/dialoger";
import { NavigationProgress } from "@/components/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "@/context/tanstack-query/devtools";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { useOffline } from "@/hooks/use-offline";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    const isOffline = useOffline();
    const navigate = useNavigate();
    const router = useRouter();
    const location = router.state.location;

    useEffect(() => {
      if (isOffline && location.pathname !== "/offline") {
        navigate({ to: "/offline" });
      }
    }, [isOffline, location.pathname, navigate]);

    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        <Dialoger />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
