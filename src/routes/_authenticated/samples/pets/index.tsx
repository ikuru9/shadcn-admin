import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";
import { Pets } from "@/features/samples/pets";
import { findPetsByStatusSuspenseQueryOptions } from "@/gen/hooks";

const petSearchSchema = v.object({
  page: v.optional(v.number(), 1),
  pageSize: v.optional(v.number(), 10),
  // Facet filters
  status: v.optional(v.picklist(["available", "pending", "sold"]), "available"),
  // Per-column text filter
  name: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/_authenticated/samples/pets/")({
  validateSearch: petSearchSchema,
  loaderDeps: ({ search }) => ({
    status: search.status,
  }),
  loader: ({ context: { queryClient }, deps }) => {
    const { status } = deps;
    return queryClient.ensureQueryData({
      ...findPetsByStatusSuspenseQueryOptions({
        status: status || "available",
      }),
      staleTime: Infinity,
    });
  },
  component: Pets,
});
