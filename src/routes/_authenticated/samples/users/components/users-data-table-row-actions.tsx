import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, UserPen } from "lucide-react";
import * as z from "zod/mini";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { useSubmissionToast } from "@/hooks/use-submission-toast";

import type { User } from "./data/schema";
import { UsersActionDialog } from "./users-action-dialog";

interface DataTableRowActionsProps {
  row: Row<User>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { openDialog, prompt } = useDialog();
  const showSubmittedData = useSubmissionToast();

  const handleDelete = async () => {
    const username = await prompt({
      title: "Delete User",
      description: `Type ${row.original.username} to confirm deletion.`,
      promptLabel: "Username",
      promptPlaceholder: row.original.username,
      confirmText: "Delete",
      cancelText: "Cancel",
      destructive: true,
      validationSchema: z
        .string()
        .check(z.refine((value) => value.trim() === row.original.username, "Username does not match.")),
      className: "sm:max-w-sm",
    });

    if (username == null) return;

    showSubmittedData(row.original, "The following user has been deleted:");
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" />}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            void openDialog(UsersActionDialog, {
              currentRow: row.original,
              className: "sm:max-w-lg",
            });
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void handleDelete();
          }}
          className="text-red-500!"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
