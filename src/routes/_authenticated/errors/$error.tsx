import { createFileRoute } from "@tanstack/react-router";

import { ForbiddenError } from "./components/forbidden-error";
import { GeneralError } from "./components/general-error";
import { MaintenanceError } from "./components/maintenance-error";
import { NotFoundError } from "./components/not-found-error";
import { UnauthorizedError } from "./components/unauthorized-error";

export const Route = createFileRoute("/_authenticated/errors/$error")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error } = Route.useParams();

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorizedError,
    forbidden: ForbiddenError,
    "not-found": NotFoundError,
    "internal-server-error": GeneralError,
    "maintenance-error": MaintenanceError,
  };
  const ErrorComponent = errorMap[error] || NotFoundError;

  return (
    <div className="flex-1 [&>div]:h-full">
      <ErrorComponent />
    </div>
  );
}
