import { createFileRoute } from "@tanstack/react-router";

import { OfflineError } from "@/features/errors/offline-error";

export const Route = createFileRoute("/offline")({
  component: OfflineError,
});
