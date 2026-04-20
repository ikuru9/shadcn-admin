import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePet } from "@/gen/hooks";
import type { Pet } from "@/gen/types/Pet";
import { useDialog } from "@/hooks/use-dialog";

interface DataTableRowActionsProps {
  row: Row<Pet>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { confirm } = useDialog();
  const deletePet = useDeletePet();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (row.original.id == null) {
      toast.error("Cannot delete a pet without an ID.");
      return;
    }

    try {
      await deletePet.mutateAsync({ petId: row.original.id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [{ url: "/pet/findByStatus" }] }),
        queryClient.invalidateQueries({ queryKey: [{ url: "/pet/:petId" }] }),
      ]);
      toast.success(`Deleted ${row.original.name}.`);
    } catch {
      toast.error("Failed to delete pet.");
    }
  };

  const handleDeleteClick = async () => {
    const result = await confirm({
      title: `삭제: ${row.original.name}?`,
      description: `This will permanently remove ${row.original.name} from the sample data.`,
      confirmText: "삭제",
      cancelText: "취소",
      destructive: true,
      className: "sm:max-w-sm",
    });

    if (!result) {
      return;
    }

    await handleDelete();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500!">
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
