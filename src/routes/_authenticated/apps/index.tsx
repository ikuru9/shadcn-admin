import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";
import { Apps } from "@/features/apps";

const appsSearchSchema = v.object({
  type: v.optional(v.picklist(["all", "connected", "notConnected"])),
  filter: v.optional(v.string(), ""),
  sort: v.optional(v.picklist(["asc", "desc"])),
});

export const Route = createFileRoute("/_authenticated/apps/")({
  validateSearch: appsSearchSchema,
  component: Apps,
});
