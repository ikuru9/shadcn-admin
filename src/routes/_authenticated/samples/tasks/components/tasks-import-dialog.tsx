import { useForm } from "react-hook-form";
import * as z from "zod/mini";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSubmissionToast } from "@/hooks/use-submission-toast";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";

const formSchema = z.object({
  file: z.instanceof(FileList).check(
    z.refine((files) => files.length > 0, "Please upload a file"),
    z.refine((files) => ["text/csv"].includes(files?.[0]?.type), "Please upload csv format."),
  ),
});

interface TaskImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TasksImportDialog({ open, onOpenChange }: TaskImportDialogProps) {
  const showSubmittedData = useSubmissionToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodMiniResolver(formSchema),
    defaultValues: { file: undefined },
  });

  const fileRef = form.register("file");

  const onSubmit = () => {
    const file = form.getValues("file");

    if (file?.[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      };
      showSubmittedData(fileDetails, "You have imported the following file:");
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        form.reset();
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-start">
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>Import tasks quickly from a CSV file.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form id="task-import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem className="my-2">
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} className="h-8 py-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button type="submit" form="task-import-form">
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
