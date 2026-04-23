import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Main } from "@/components/layout/main";
import { QueryError } from "@/components/query-error";

import { roles } from "./components/data/data";
import { users } from "./components/data/users";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersTable } from "./components/users-table";

const roleValues = roles.map((r) => r.value) as [(typeof roles)[number]["value"], ...(typeof roles)[number]["value"][]];

const usersSearchSchema = z.object({
  page: z.optional(z.number()),
  pageSize: z.optional(z.number()),
  status: z.optional(z.array(z.enum(["active", "inactive", "invited", "suspended"]))),
  role: z.optional(z.array(z.enum(roleValues))),
  username: z.optional(z.string()),
  sort: z.optional(z.enum(["username", "fullName", "email"])),
  order: z.optional(z.enum(["asc", "desc"])),
});

const route = getRouteApi("/_authenticated/samples/users/");

function Users() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">User List</h2>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <UsersPrimaryButtons />
      </div>
      <UsersTable data={users ?? []} search={search} navigate={navigate} />
    </Main>
  );
}

export const Route = createFileRoute("/_authenticated/samples/users/")({
  validateSearch: usersSearchSchema,
  component: Users,
  errorComponent: QueryError,
});
