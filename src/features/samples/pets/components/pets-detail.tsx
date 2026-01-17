import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPetByIdSuspenseQueryOptions } from "@/gen/hooks";

const route = getRouteApi("/_authenticated/samples/pets/$id");

export function PetsDetail() {
  const { id } = route.useParams();
  const { data: pet } = useSuspenseQuery(getPetByIdSuspenseQueryOptions(parseInt(id, 10)));

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">{pet.name}</h2>
            <p className="text-muted-foreground">Pet details and information.</p>
          </div>
          <Button variant="outline">Edit Pet</Button>
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
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: label */}
                  <label className="font-medium text-sm">ID</label>
                  <p className="text-muted-foreground text-sm">{pet.id}</p>
                </div>
                <div>
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: label */}
                  <label className="font-medium text-sm">Name</label>
                  <p className="text-muted-foreground text-sm">{pet.name}</p>
                </div>
                <div>
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: label */}
                  <label className="font-medium text-sm">Category</label>
                  <p className="text-muted-foreground text-sm">{pet.category?.name || "N/A"}</p>
                </div>
                <div>
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: label */}
                  <label className="font-medium text-sm">Status</label>
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
    </>
  );
}
