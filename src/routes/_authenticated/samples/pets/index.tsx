import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import * as z from "zod/mini";

import { Main } from "@/components/layout/main";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { findPetsByStatusSuspenseQueryOptions, useFindPetsByStatusSuspense } from "@/gen/hooks";
import { findPetsByStatusQueryParamsSchema } from "@/gen/zod";

import { PetsTable } from "./components/pets-table";

const petSearchSchema = z.object({
  status: z.optional(findPetsByStatusQueryParamsSchema.shape.status),
});

const route = getRouteApi("/_authenticated/samples/pets/");

function Pets() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const status = search.status ?? "available";

  const { data: pets } = useFindPetsByStatusSuspense({
    params: {
      status,
    },
  });

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Pets List</h2>
          <p className="text-muted-foreground">Manage your pets and their information here.</p>
        </div>
        <Button className="space-x-1" onClick={() => navigate({ to: "/samples/pets/new" })}>
          <span>Add Pet</span> <Plus size={18} />
        </Button>
      </div>
      <PetsTable data={pets || []} search={search} navigate={navigate} />
    </Main>
  );
}

export const Route = createFileRoute("/_authenticated/samples/pets/")({
  validateSearch: petSearchSchema,
  loaderDeps: ({ search }) => ({
    status: search.status ?? "available",
  }),
  loader: async ({ context: { queryClient }, deps }) => {
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
  errorComponent: QueryError,
});
