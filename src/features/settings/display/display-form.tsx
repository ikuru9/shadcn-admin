import * as v from "valibot";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { showSubmittedData } from "@/lib/show-submitted-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const;

const displayFormSchema = v.object({
  items: v.pipe(
    v.array(v.string()),
    v.someItem(
      (item) => !!item, // 최소 하나 이상의 아이템이 truthy(존재)해야 함
      "You have to select at least one item.",
    ),
  ),
});

type DisplayFormValues = v.InferOutput<typeof displayFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ["recents", "home"],
};

export function DisplayForm() {
  const form = useForm<DisplayFormValues>({
    resolver: valibotResolver(displayFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => showSubmittedData(data))} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-start">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update display</Button>
      </form>
    </Form>
  );
}
