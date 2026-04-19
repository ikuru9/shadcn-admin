import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { Main } from "@/components/layout/main";
import { findPetsByStatusSuspenseQueryOptions } from "@/gen/hooks";

import { PetsProvider } from "./components/pets-provider";
import { PetsTable } from "./components/pets-table";

const petSearchSchema = z.object({
  page: z.prefault(z.number(), 1),
  pageSize: z.prefault(z.number(), 10),
  // Facet filters
  status: z.prefault(z.enum(["available", "pending", "sold"]), "available"),
  // Per-column text filter
  name: z.prefault(z.string(), ""),
});

const route = getRouteApi("/_authenticated/samples/pets/");

const Pets = () => {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data: pets } = useSuspenseQuery(
    findPetsByStatusSuspenseQueryOptions({
      params: {
        status: search.status,
      },
    }),
  );

  return (
    <PetsProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Pets List</h2>
            <p className="text-muted-foreground">Manage your pets and their information here.</p>
          </div>
        </div>
        <PetsTable data={pets || []} search={search} navigate={navigate} />
      </Main>
    </PetsProvider>
  );
};

export const Route = createFileRoute("/_authenticated/samples/pets/")({
  validateSearch: petSearchSchema,
  loaderDeps: ({ search }) => ({
    status: search.status,
  }),
  loader: ({ context: { queryClient }, deps }) => {
    const { status } = deps;
    return queryClient.ensureQueryData({
      ...findPetsByStatusSuspenseQueryOptions({
        params: {
          status: status || "available",
        },
      }),
      staleTime: Infinity,
    });
  },
  component: Pets,
});
