import { useState } from "react";

import { getCoreRowModel, type RowSelectionState, useReactTable, type VisibilityState } from "@tanstack/react-table";
import { pascalCase } from "es-toolkit";

import { DataTable, DataTableToolbar } from "@/components/data-table";
import { type Pet, petStatusEnum } from "@/gen/types/Pet";
import { type NavigateFn, useTableUrlState } from "@/hooks/use-table-url-state";

import { DataTableBulkActions } from "./data-table-bulk-actions";
import { petsColumns as columns } from "./pets-columns";

interface DataTableProps {
  data: Pet[];
  search: Record<string, unknown>;
  navigate: NavigateFn;
}

export function PetsTable({ data, search, navigate }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { customFilters } = useTableUrlState({
    search,
    navigate,
    customFilters: [{ key: "status", multiple: false }],
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={'flex flex-1 flex-col gap-4 max-sm:has-[div[role="toolbar"]]:mb-16'}>
      <DataTableToolbar
        table={table}
        customFilters={customFilters.map((filter) => ({
          title: "Status",
          multiple: false,
          value: filter.value,
          onValueChange: filter.onValueChange,
          options: Object.values(petStatusEnum).map((value) => ({ value, label: pascalCase(value) })),
        }))}
      />
      <div className="overflow-hidden rounded-md border">
        <DataTable table={table} className="min-w-xl" />
      </div>
      <DataTableBulkActions table={table} />
    </div>
  );
}
