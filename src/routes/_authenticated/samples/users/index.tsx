import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { Main } from "@/components/layout/main";
import { QueryError } from "@/components/query-error";

import { users } from "./components/data/users";
import { usersSearchSchema } from "./components/data/search-schema";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersTable } from "./components/users-table";

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
