import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Pets } from "@/features/samples/pets";
import { findPetsByStatusSuspenseQueryOptions } from "@/gen/hooks";

const petSearchSchema = z.object({
  page: z.prefault(z.number(), 1),
  pageSize: z.prefault(z.number(), 10),
  // Facet filters
  status: z.prefault(z.enum(["available", "pending", "sold"]), "available"),
  // Per-column text filter
  name: z.prefault(z.string(), ""),
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
