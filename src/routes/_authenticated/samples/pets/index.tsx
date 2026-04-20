import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Main } from "@/components/layout/main";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findPetsByStatusSuspenseQueryOptions, useFindPetsByStatusSuspense } from "@/gen/hooks";

import { PetsTable } from "./components/pets-table";

const petSearchSchema = z.object({
  page: z.prefault(z.number(), 1),
  pageSize: z.prefault(z.number(), 10),
  // Server-side filter
  status: z.prefault(z.enum(["available", "pending", "sold"]), "available"),
  // Per-column text filter
  name: z.prefault(z.string(), ""),
});

const route = getRouteApi("/_authenticated/samples/pets/");

const petStatuses = [
  { label: "Available", value: "available" },
  { label: "Pending", value: "pending" },
  { label: "Sold", value: "sold" },
] as const;

function Pets() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data: pets } = useFindPetsByStatusSuspense({
    params: {
      status: search.status,
    },
  });

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Pets List</h2>
          <p className="text-muted-foreground">Manage your pets and their information here.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pet-status-filter" className="text-muted-foreground text-sm">
            Status
          </Label>
          <Select
            value={search.status}
            onValueChange={(value) => {
              const nextStatus = value ?? search.status;

              navigate({
                replace: true,
                search: (prev) => ({
                  ...prev,
                  page: undefined,
                  status: nextStatus,
                }),
              });
            }}
          >
            <SelectTrigger id="pet-status-filter" className="w-40">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {petStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <PetsTable data={pets || []} search={search} navigate={navigate} />
    </Main>
  );
}

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
