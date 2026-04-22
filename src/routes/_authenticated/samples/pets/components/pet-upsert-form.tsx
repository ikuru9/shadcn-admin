import { useState } from "react";

import { pascalCase } from "es-toolkit";
import { ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type * as z from "zod/mini";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/gen/types/Category";
import type { Pet } from "@/gen/types/Pet";
import { petStatusEnum } from "@/gen/types/Pet";
import type { Tag } from "@/gen/types/Tag";
import { petSchema } from "@/gen/zod";
import { cn } from "@/lib/utils";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";

const petStatusOptions = Object.keys(petStatusEnum).map((value) => ({
  value,
  label: pascalCase(value),
}));

const categoryOptions: Category[] = [
  { id: 1, name: "Dog" },
  { id: 2, name: "Cat" },
  { id: 3, name: "Bird" },
  { id: 4, name: "Fish" },
  { id: 5, name: "Reptile" },
];

const tagSuggestions: Tag[] = [
  { id: 1, name: "friendly" },
  { id: 2, name: "playful" },
  { id: 3, name: "vaccinated" },
  { id: 4, name: "trained" },
  { id: 5, name: "calm" },
  { id: 6, name: "energetic" },
];

type PetForm = z.infer<typeof petSchema>;
export type PetUpsertValues = PetForm;

type PetUpsertMode = "create" | "edit";

type PetUpsertFormProps = {
  mode: PetUpsertMode;
  pet?: Pet;
  isSubmitting?: boolean;
  onSubmit: (values: PetForm) => Promise<void>;
  onDone: () => void;
};

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function PetTagsSelect({ value, onChange }: { value: Tag[]; onChange: (value: Tag[] | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectedTags = value ?? [];
  const selectedTagNames = new Set(selectedTags.map((tag) => normalizeTag(tag.name ?? "")));

  const addTag = (tagName: string) => {
    const name = tagName.trim();
    if (!name) return;

    const normalized = normalizeTag(name);
    if (selectedTagNames.has(normalized)) return;

    onChange([...selectedTags, { id: selectedTags.length + 1, name }]);
    setInputValue("");
    setOpen(false);
  };

  const removeTag = (tagName?: string) => {
    const next = selectedTags.filter((tag) => tag.name !== tagName);
    onChange(next.length ? next : undefined);
  };

  const availableSuggestions = tagSuggestions.filter((tag) => !selectedTagNames.has(normalizeTag(tag.name ?? "")));

  return (
    <FormItem>
      <FormLabel>Tags (optional)</FormLabel>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={`${tag.id ?? tag.name}`} variant="secondary" className="gap-1 pr-1">
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => removeTag(tag.name)}
                className="inline-flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                aria-label={`Remove ${tag.name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button type="button" variant="outline" className="justify-between" />}>
          <span className={cn("truncate", selectedTags.length === 0 && "text-muted-foreground")}>
            {selectedTags.length > 0 ? "Add more tags" : "Select or type tags"}
          </span>
          <ChevronsUpDown className="size-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag(inputValue);
              }
            }}
          >
            <CommandInput value={inputValue} onValueChange={setInputValue} placeholder="Type a tag" />
            <CommandList>
              <CommandEmpty>Press Enter to create a new tag.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {availableSuggestions.map((tag) => (
                  <CommandItem key={tag.id ?? tag.name} onSelect={() => addTag(tag.name ?? "")}>
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

export function PetUpsertForm({ mode, pet, isSubmitting, onSubmit, onDone }: PetUpsertFormProps) {
  const defaultValues = getDefaultValues(pet);

  const form = useForm<PetForm>({
    resolver: zodMiniResolver(petSchema),
    defaultValues,
  });

  const photoUrls = form.watch("photoUrls") ?? [];

  const handleSubmit = async (values: PetForm) => {
    await onSubmit(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create Pet" : "Edit Pet"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Add a new pet to the sample store." : "Update the pet information."}
        </CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <CardContent className="space-y-4">
            {mode === "edit" && (
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fluffy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {petStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (optional)</FormLabel>
                    <Select
                      value={field.value?.name ?? ""}
                      onValueChange={(value) => {
                        field.onChange(
                          value === "" ? undefined : categoryOptions.find((category) => category.name === value),
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.id ?? category.name} value={category.name ?? ""}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => <PetTagsSelect value={field.value ?? []} onChange={field.onChange} />}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Photo URLs</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => {
                    form.setValue("photoUrls", [...photoUrls, ""], { shouldDirty: true, shouldValidate: true });
                  }}
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-2">
                {photoUrls.map((photoUrl, index) => (
                  <FormField
                    key={`${photoUrl}`}
                    control={form.control}
                    name={`photoUrls.${index}`}
                    render={({ field: photoField }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="https://example.com/pet.jpg" {...photoField} />
                          </FormControl>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              onClick={() => {
                                form.setValue(
                                  "photoUrls",
                                  photoUrls.filter((_, currentIndex) => currentIndex !== index),
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              }}
                              aria-label="Remove photo URL"
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Save changes" : "Update pet"}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}

function getDefaultValues(pet?: Pet): PetForm {
  const baseValues: PetForm = {
    id: undefined,
    name: "",
    photoUrls: [""],
    status: "available",
    category: undefined,
    tags: undefined,
  };

  if (!pet) {
    return baseValues;
  }

  return {
    ...baseValues,
    id: pet.id,
    name: pet.name,
    photoUrls: pet.photoUrls.length > 0 ? pet.photoUrls : [""],
    status: pet.status ?? "available",
    category: pet.category,
    tags: pet.tags,
  };
}
