import React from "react";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { type ErrorComponentProps, useNavigate, useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QueryErrorKind = "forbidden" | "not-found" | "server";
type QueryErrorProps = ErrorComponentProps & React.HTMLAttributes<HTMLDivElement>;

const errorContent: Record<QueryErrorKind, { title: string; heading: string; description: string }> = {
  forbidden: {
    title: "403",
    heading: "Oops! Forbidden!",
    description: "You do not have permission to view this resource.",
  },
  "not-found": {
    title: "404",
    heading: "Oops! Data Not Found!",
    description: "The requested data could not be found.",
  },
  server: {
    title: "500",
    heading: "Oops! Something went wrong :')",
    description: "We apologize for the inconvenience. Please try again later.",
  },
};

function getQueryErrorKind(error: unknown): QueryErrorKind {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 403) return "forbidden";
    if (status === 404) return "not-found";
  }

  return "server";
}

export function QueryError({ className, error }: QueryErrorProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const { history } = router;
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const kind = getQueryErrorKind(error);
  const content = errorContent[kind];

  React.useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  const handleRetry = () => {
    queryErrorResetBoundary.reset();
    router.invalidate();
  };

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-[7rem] leading-tight">{content.title}</h1>
        <span className="font-medium">{content.heading}</span>
        <p className="text-center text-muted-foreground">{content.description}</p>

        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button variant="outline" onClick={handleRetry}>
            Retry
          </Button>
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
