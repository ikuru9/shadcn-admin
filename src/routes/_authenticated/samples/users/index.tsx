import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Main } from "@/components/layout/main";

import { roles } from "./components/data/data";
import { users } from "./components/data/users";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";

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

const route = getRouteApi("/_authenticated/samples/users/");

const Users = () => {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <UsersProvider>
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

      <UsersDialogs />
    </UsersProvider>
  );
};

export const Route = createFileRoute("/_authenticated/samples/users/")({
  validateSearch: usersSearchSchema,
  component: Users,
});
