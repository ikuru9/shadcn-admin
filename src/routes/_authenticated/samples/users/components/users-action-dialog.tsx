"use client";

import { useForm } from "react-hook-form";
import * as z from "zod/mini";

import { PasswordInput } from "@/components/custom-input/password-input";
import { SelectDropdown } from "@/components/select-dropdown";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSubmissionToast } from "@/hooks/use-submission-toast";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";

import { roles } from "./data/data";
import type { User } from "./data/schema";

const formSchema = z
  .object({
    firstName: z.string().check(z.minLength(1, "First Name is required.")),
    lastName: z.string().check(z.minLength(1, "Last Name is required.")),
    username: z.string().check(z.minLength(1, "Username is required.")),
    phoneNumber: z.string().check(z.minLength(1, "Phone number is required.")),
    email: z.email("Email is required."),
    password: z.string().check(z.trim()),
    role: z.string().check(z.minLength(1, "Role is required.")),
    confirmPassword: z.string().check(z.trim()),
    isEdit: z.boolean(),
  })
  .check(
    z.superRefine((data, ctx) => {
      if (data.isEdit) {
        if (data.password && data.password.length < 7) {
          ctx.addIssue({ code: "custom", message: "Password must be at least 7 characters long", path: ["password"] });
        }

        if (!data.confirmPassword) return;
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
        }
        return;
      }

      if (data.password.length < 7) {
        ctx.addIssue({ code: "custom", message: "Password must be at least 7 characters long", path: ["password"] });
      }

      if (data.password !== data.confirmPassword) {
        ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
      }
    }),
  );
type UserForm = z.infer<typeof formSchema>;

interface UserActionDialogProps {
  currentRow?: User;
  onConfirm: (values: UserForm) => void;
  onCancel?: () => void;
}

export function UsersActionDialog({ currentRow, onConfirm, onCancel }: UserActionDialogProps) {
  const isEdit = !!currentRow;
  const showSubmittedData = useSubmissionToast();
  const form = useForm<UserForm>({
    resolver: zodMiniResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: "",
          confirmPassword: "",
          isEdit,
        }
      : {
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          role: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          isEdit,
        },
  });

  const onSubmit = (values: UserForm) => {
    form.reset();
    showSubmittedData(values);
    onConfirm(values);
  };

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <>
      <DialogHeader className="text-start">
        <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Update the user here. " : "Create new user here. "}
          Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
        <FormProvider {...form}>
          <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-0.5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" className="col-span-4" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className="col-span-4" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john_doe" className="col-span-4" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@gmail.com" className="col-span-4" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+123456789" className="col-span-4" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                    className="col-span-4"
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="e.g., S3cur3P@ssw0rd" className="col-span-4" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                  <FormLabel className="col-span-2 text-end">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={!isPasswordTouched}
                      placeholder="e.g., S3cur3P@ssw0rd"
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 col-start-3" />
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            onCancel?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" form="user-form">
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
