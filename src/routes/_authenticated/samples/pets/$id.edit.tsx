import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Main } from "@/components/layout/main";
import { QueryError } from "@/components/query-error";
import { findPetsByStatusSuspenseQueryKey, getPetByIdQueryOptions, getPetByIdSuspenseQueryKey, useGetPetByIdSuspense, useUpdatePet } from "@/gen/hooks";
import { useSubmissionToast } from "@/hooks/use-submission-toast";

import { PetUpsertForm, type PetUpsertValues } from "./components/pet-upsert-form";

const route = getRouteApi("/_authenticated/samples/pets/$id/edit");

function PetsEdit() {
  const { id } = route.useParams();
  const navigate = route.useNavigate();
  const { data: pet } = useGetPetByIdSuspense({ petId: parseInt(id, 10) });
  const updatePet = useUpdatePet();
  const queryClient = useQueryClient();
  const showSubmittedData = useSubmissionToast();

  const handleSubmit = async (values: PetUpsertValues) => {
    await updatePet.mutateAsync({
      data: {
        id: values.id ?? pet.id,
        name: values.name,
        photoUrls: values.photoUrls.map((photoUrl) => photoUrl.trim()),
        status: values.status,
        ...(values.category ? { category: values.category } : {}),
        ...(values.tags?.length ? { tags: values.tags } : {}),
      },
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: findPetsByStatusSuspenseQueryKey({ status: "available" }) }),
      queryClient.invalidateQueries({ queryKey: findPetsByStatusSuspenseQueryKey({ status: "pending" }) }),
      queryClient.invalidateQueries({ queryKey: findPetsByStatusSuspenseQueryKey({ status: "sold" }) }),
      queryClient.invalidateQueries({ queryKey: getPetByIdSuspenseQueryKey({ petId: pet.id ?? parseInt(id, 10) }) }),
    ]);

    showSubmittedData(values);
    navigate({ to: "/samples/pets/$id", params: { id } });
  };

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Edit Pet</h2>
          <p className="text-muted-foreground">Update pet information and return to the detail page.</p>
        </div>
        <button type="button" className="text-sm underline underline-offset-4" onClick={() => navigate({ to: "/samples/pets/$id", params: { id } })}>
          Back to detail
        </button>
      </div>

      <PetUpsertForm
        mode="edit"
        pet={pet}
        isSubmitting={updatePet.isPending}
        onSubmit={handleSubmit}
        onDone={() => navigate({ to: "/samples/pets/$id", params: { id } })}
      />
    </Main>
  );
}

export const Route = createFileRoute("/_authenticated/samples/pets/$id/edit")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getPetByIdQueryOptions({ petId: parseInt(id, 10) })),
  component: PetsEdit,
  errorComponent: QueryError,
});
