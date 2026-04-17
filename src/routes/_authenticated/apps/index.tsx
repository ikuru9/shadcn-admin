import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Apps } from "@/features/apps";

const appsSearchSchema = z.object({
  type: z.optional(z.enum(["all", "connected", "notConnected"])),
  filter: z.prefault(z.string(), ""),
  sort: z.optional(z.enum(["asc", "desc"])),
});

export const Route = createFileRoute("/_authenticated/apps/")({
  validateSearch: appsSearchSchema,
  component: Apps,
});
