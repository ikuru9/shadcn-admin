import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { findPetsByStatusSuspenseQueryKey, useAddPet } from "@/gen/hooks";
import { createAuthenticatedBeforeLoad } from "@/routes/_authenticated/-auth-guards";

import { PetUpsertForm, type PetUpsertValues } from "./components/pet-upsert-form";

const menuKey = "/samples/pets/new";
const route = getRouteApi("/_authenticated/samples/pets/new");

function PetsCreate() {
  const navigate = route.useNavigate();
  const addPet = useAddPet();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: PetUpsertValues) => {
    await addPet.mutateAsync({
      data: {
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
    ]);

    toast.success("알림", {
      description: (
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    navigate({ to: "/samples/pets" });
  };

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Create Pet</h2>
          <p className="text-muted-foreground">Add a new pet to the sample store.</p>
        </div>
        <Button variant="outline" className="space-x-1" onClick={() => navigate({ to: "/samples/pets" })}>
          <ArrowLeft size={18} />
          <span>Back to list</span>
        </Button>
      </div>

      <PetUpsertForm
        mode="create"
        isSubmitting={addPet.isPending}
        onSubmit={handleSubmit}
        onDone={() => navigate({ to: "/samples/pets" })}
      />
    </Main>
  );
}

export const Route = createFileRoute("/_authenticated/samples/pets/new")({
  beforeLoad: createAuthenticatedBeforeLoad(menuKey),
  component: PetsCreate,
});
