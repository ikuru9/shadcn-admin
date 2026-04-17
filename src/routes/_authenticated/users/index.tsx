import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Users } from "@/features/users";
import { roles } from "@/features/users/data/data";

const roleValues = roles.map((r) => r.value) as [(typeof roles)[number]["value"], ...(typeof roles)[number]["value"][]];

const usersSearchSchema = z.object({
  page: z.prefault(z.number(), 1),
  pageSize: z.prefault(z.number(), 10),
  // Facet filters
  status: z.prefault(z.array(z.enum(["active", "inactive", "invited", "suspended"])), []),
  role: z.prefault(z.array(z.enum(roleValues)), []),
  // Per-column text filter (example for username)
  username: z.prefault(z.string(), ""),
});

export const Route = createFileRoute("/_authenticated/users/")({
  validateSearch: usersSearchSchema,
  component: Users,
});
