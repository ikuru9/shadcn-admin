import { createFileRoute } from "@tanstack/react-router";

import { TanstackErrorComponent } from "@/features/errors/tanstack-error";
import { PetsDetail } from "@/features/samples/pets/components/pets-detail";
import { getPetByIdQueryOptions } from "@/gen/hooks";

export const Route = createFileRoute("/_authenticated/samples/pets/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getPetByIdQueryOptions(parseInt(id, 10))),
  component: PetsDetail,
  errorComponent: TanstackErrorComponent,
});
