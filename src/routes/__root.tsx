import { useEffect } from "react";

import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Dialoger } from "@/components/dialogs/dialoger";
import { NavigationProgress } from "@/components/navigation-progress";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "@/context/tanstack-query/devtools";
import { useOffline } from "@/hooks/use-offline";
import { cn } from "@/lib/utils";

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
};

const GeneralError = ({ className, minimal = false }: GeneralErrorProps) => {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && <h1 className="font-bold text-[7rem] leading-tight">500</h1>}
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-center text-muted-foreground">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const NotFoundError = () => {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-[7rem] leading-tight">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you&apos;re looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

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
