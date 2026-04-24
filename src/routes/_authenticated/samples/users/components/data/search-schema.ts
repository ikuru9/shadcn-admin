import * as z from "zod/mini";

import { roles } from "./data";

const roleValues = roles.map((role) => role.value) as [(typeof roles)[number]["value"], ...(typeof roles)[number]["value"][]];

export const usersSearchSchema = z.object({
  page: z.optional(z.number()),
  pageSize: z.optional(z.number()),
  status: z.optional(z.array(z.enum(["active", "inactive", "invited", "suspended"]))),
  role: z.optional(z.array(z.enum(roleValues))),
  username: z.optional(z.string()),
  sort: z.optional(z.enum(["username", "fullName", "email"])),
  order: z.optional(z.enum(["asc", "desc"])),
});
