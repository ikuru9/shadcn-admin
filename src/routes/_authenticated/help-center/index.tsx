import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/coming-soon";

import { createAuthenticatedBeforeLoad as createHelpCenterBeforeLoad } from "@/routes/_authenticated/-auth-guards";

const helpCenterMenuKey = "/help-center/";

export const Route = createFileRoute("/_authenticated/help-center/")({
  beforeLoad: createHelpCenterBeforeLoad(helpCenterMenuKey),
  component: ComingSoon,
});
