import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorComponent, type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import React from "react";

function TanstackErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  // if (error instanceof PostNotFoundError) {
  //   return <div>{error.message}</div>;
  // }
  //

  React.useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      <button
        onClick={() => {
          router.invalidate();
        }}
      >
        retry
      </button>
      <ErrorComponent error={error} />
    </div>
  );
}

export { TanstackErrorComponent };
