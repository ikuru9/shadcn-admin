import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "@/features/users";
import { roles } from "@/features/users/data/data";

const usersSearchSchema = v.object({
  page: v.optional(v.number(), 1),
  pageSize: v.optional(v.number(), 10),
  // Facet filters
  status: v.optional(v.array(v.picklist(["active", "inactive", "invited", "suspended"])), []),
  role: v.optional(
    v.array(v.picklist(roles.map((r) => r.value as (typeof roles)[number]["value"]))),
    [],
  ),
  // Per-column text filter (example for username)
  username: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/_authenticated/users/")({
  validateSearch: usersSearchSchema,
  component: Users,
});
