import { MailPlus, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";

import { SelectDropdown } from "@/components/select-dropdown";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSubmittedData } from "@/lib/show-submitted-data";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";

import { roles } from "./data/data";

const formSchema = z.object({
  email: z.email("Please enter an email to invite."),
  role: z.string().check(z.minLength(1, "Role is required.")),
  desc: z.optional(z.string()),
});

type UserInviteForm = z.infer<typeof formSchema>;

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersInviteDialog({ open, onOpenChange }: UserInviteDialogProps) {
  const form = useForm<UserInviteForm>({
    resolver: zodMiniResolver(formSchema),
    defaultValues: { email: "", role: "", desc: "" },
  });

  const onSubmit = (values: UserInviteForm) => {
    form.reset();
    showSubmittedData(values);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <MailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email invitation. Assign a role to define their access
            level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="user-invite-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="eg: john.doe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Add a personal note to your invitation (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" form="user-invite-form">
            Invite <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
