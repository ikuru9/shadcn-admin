import { createFileRoute } from "@tanstack/react-router";

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

import { createAuthenticatedBeforeLoad } from "./-auth-guards";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: createAuthenticatedBeforeLoad(),
  component: AuthenticatedLayout,
});
