import { useState } from "react";

import { getCoreRowModel, type RowSelectionState, useReactTable, type VisibilityState } from "@tanstack/react-table";

import { DataTable, DataTableToolbar } from "@/components/data-table";
import type { Pet } from "@/gen/types/Pet";
import { findPetsByStatusQueryParamsSchema } from "@/gen/zod";
import { useDataTableConfigs } from "@/hooks/use-data-table-configs";
import { type NavigateFn, useDataTableUrlState } from "@/hooks/use-data-table-url-state";

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

  const { urlStateParams, customFilters } = useDataTableConfigs({
    columns,
    schema: findPetsByStatusQueryParamsSchema,
    customFilterKeys: ["status"],
  });

  const { customFilters: stateCustomFilters } = useDataTableUrlState({
    search,
    navigate,
    ...urlStateParams,
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
        filters={customFilters.map((filter) => ({
          ...filter,
          value: stateCustomFilters.find((item) => item.key === filter.columnId)?.value,
          onValueChange: stateCustomFilters.find((item) => item.key === filter.columnId)?.onValueChange,
        }))}
      />
      <div className="overflow-hidden rounded-md border">
        <DataTable table={table} className="min-w-xl" />
      </div>
      <DataTableBulkActions table={table} />
    </div>
  );
}
