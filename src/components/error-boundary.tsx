import {
  ErrorBoundary as BaseErrorBoundary,
  type ErrorBoundaryPropsWithComponent,
  type FallbackProps,
} from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>

      <pre style={{ color: "red" }}>{error.message}</pre>

      <button type="button" onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
}

function ErrorBoundary({
  children,
  ...props
}: React.PropsWithChildren<Omit<ErrorBoundaryPropsWithComponent, "FallbackComponent">>) {
  return (
    <BaseErrorBoundary FallbackComponent={Fallback} {...props}>
      {children}
    </BaseErrorBoundary>
  );
}

export { ErrorBoundary };
