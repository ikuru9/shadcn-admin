import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table";
import { PetsMultiDeleteDialog } from "./pets-multi-delete-dialog";
import { type Pet } from "../data/schema";

interface DataTableBulkActionsProps {
  table: Table<Pet>;
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName="pet">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected pets"
              title="Delete selected pets"
            >
              <Trash2 />
              <span className="sr-only">Delete selected pets</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected pets</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <PetsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
