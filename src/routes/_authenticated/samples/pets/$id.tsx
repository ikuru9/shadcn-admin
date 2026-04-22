import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { Main } from "@/components/layout/main";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getPetByIdQueryOptions, useGetPetByIdSuspense } from "@/gen/hooks";
import { QueryError } from "@/components/query-error";

const route = getRouteApi("/_authenticated/samples/pets/$id");

function PetsDetail() {
  const { id } = route.useParams();
  const navigate = route.useNavigate();
  const { data: pet } = useGetPetByIdSuspense({ petId: parseInt(id, 10) });

  return (
    <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">{pet.name}</h2>
          <p className="text-muted-foreground">Pet details and information.</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/samples/pets/$id/edit", params: { id } })}>
          Edit Pet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about this pet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="font-medium text-sm">ID</Label>
                <p className="text-muted-foreground text-sm">{pet.id}</p>
              </div>
              <div>
                <Label className="font-medium text-sm">Name</Label>
                <p className="text-muted-foreground text-sm">{pet.name}</p>
              </div>
              <div>
                <Label className="font-medium text-sm">Category</Label>
                <p className="text-muted-foreground text-sm">{pet.category?.name || "N/A"}</p>
              </div>
              <div>
                <Label className="font-medium text-sm">Status</Label>
                <Badge variant="outline" className="capitalize">
                  {pet.status || "Unknown"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {pet.photoUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Images of this pet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {pet.photoUrls.map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${pet.name}:photo ${index + 1}`}
                    className="h-24 w-full rounded-md object-cover"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pet.tags && pet.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Characteristics and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pet.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Main>
  );
}

export const Route = createFileRoute("/_authenticated/samples/pets/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getPetByIdQueryOptions({ petId: parseInt(id, 10) })),
  component: PetsDetail,
  errorComponent: QueryError,
});
