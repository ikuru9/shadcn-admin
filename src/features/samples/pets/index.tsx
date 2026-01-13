import { getRouteApi } from "@tanstack/react-router";
import { Main } from "@/components/layout/main";
import { PetsProvider } from "./components/pets-provider";
import { PetsTable } from "./components/pets-table";
import { findPetsByStatusSuspenseQueryOptions } from "@/gen/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";

const route = getRouteApi("/_authenticated/samples/pets/");

export function Pets() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data: pets } = useSuspenseQuery(
    findPetsByStatusSuspenseQueryOptions({
      status: search.status,
    }),
  );

  return (
    <PetsProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pets List</h2>
            <p className="text-muted-foreground">Manage your pets and their information here.</p>
          </div>
        </div>
        <PetsTable data={pets || []} search={search} navigate={navigate} />
      </Main>
    </PetsProvider>
  );
}
