import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { DataTable, DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { type NavigateFn, useTableUrlState } from "@/hooks/use-table-url-state";
import { cn } from "@/lib/utils";

import type { Pet } from "../data/schema";
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { petsColumns } from "./pets-columns";

interface DataTableProps {
  data: Pet[];
  search: Record<string, unknown>;
  navigate: NavigateFn;
}

export function PetsTable({ data, search, navigate }: DataTableProps) {
  const routerNavigate = useNavigate();

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror pet route search schema)
  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // name per-column text filter
      { columnId: "name", searchKey: "name", type: "string" },
      { columnId: "status", searchKey: "status", type: "array" },
    ],
  });

  const columns = petsColumns;

  const table = useReactTable({
    data,
    columns,
    meta: {
      navigate,
    },
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table, ensurePageInRange]);

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        "flex flex-1 flex-col gap-4",
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter pets..."
        searchKey="name"
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Available", value: "available" },
              { label: "Pending", value: "pending" },
              { label: "Sold", value: "sold" },
            ],
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <DataTable
          table={table}
          customProps={{
            row: {
              onClick(event, row) {
                if ((event.target as HTMLElement).closest("[data-select-cell]")) return;
                routerNavigate({ to: `/samples/pets/${row.original.id}` });
              },
            },
          }}
        />
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  );
}
