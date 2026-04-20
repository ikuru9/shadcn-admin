"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeletePet } from "@/gen/hooks";
import type { Pet } from "@/gen/types/Pet";

interface PetsMultiDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<Pet>;
}

const CONFIRM_WORD = "DELETE";
const petQueryKey = [{ url: "/pet/findByStatus" }];
const petDetailQueryKey = [{ url: "/pet/:petId" }];

export function PetsMultiDeleteDialog({ open, onOpenChange, table }: PetsMultiDeleteDialogProps) {
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const { mutateAsync } = useDeletePet();

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`);
      return;
    }

    try {
      await Promise.all(
        selectedRows.map((row) => {
          if (row.original.id == null) {
            throw new Error("Missing pet ID.");
          }

          return mutateAsync({ petId: row.original.id });
        }),
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: petQueryKey }),
        queryClient.invalidateQueries({ queryKey: petDetailQueryKey }),
      ]);

      setValue("");
      table.resetRowSelection();
      onOpenChange(false);
      toast.success(`Deleted ${selectedRows.length} ${selectedRows.length > 1 ? "pets" : "pet"}`);
    } catch {
      toast.error("Error");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} /> Delete {selectedRows.length}{" "}
          {selectedRows.length > 1 ? "pets" : "pet"}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the selected pets? <br />
            This action cannot be undone.
          </p>

          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span className="">Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>Please be careful, this operation can not be rolled back.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
