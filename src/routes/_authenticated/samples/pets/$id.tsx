import { createFileRoute } from "@tanstack/react-router";
import { PetsDetail } from "@/features/samples/pets/components/pets-detail";
import { getPetByIdQueryOptions } from "@/gen/hooks";
import { TanstackErrorComponent } from "@/features/errors/tanstack-error";

export const Route = createFileRoute("/_authenticated/samples/pets/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getPetByIdQueryOptions(parseInt(id))),
  component: PetsDetail,
  errorComponent: TanstackErrorComponent,
});
