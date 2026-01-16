import React from "react";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorComponent, type ErrorComponentProps, useRouter } from "@tanstack/react-router";

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
        type="button"
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
