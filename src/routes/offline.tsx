import { createFileRoute } from "@tanstack/react-router";
import { useNavigate, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OfflineErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
};

const OfflineError = ({ className, minimal = false }: OfflineErrorProps) => {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && <h1 className="font-bold text-[7rem] leading-tight">Offline</h1>}
        <span className="font-medium">You appear to be offline</span>
        <p className="text-center text-muted-foreground">
          Please check your internet connection <br />
          and try again.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: "/" })}>Retry</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/offline")({
  component: OfflineError,
});
