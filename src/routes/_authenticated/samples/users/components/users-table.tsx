import { useEffect, useState } from "react";

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

import { roles } from "./data/data";
import type { User } from "./data/schema";
import { usersColumns as columns } from "./users-columns";
import { DataTableBulkActions } from "./users-data-table-bulk-actions";

interface DataTableProps {
  data: User[];
  search: Record<string, unknown>;
  navigate: NavigateFn;
}

export function UsersTable({ data, search, navigate }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // username per-column text filter
      { columnId: "username", searchKey: "username", type: "string" },
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "role", searchKey: "role", type: "array" },
    ],
  });

  const table = useReactTable({
    data,
    columns,
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
    <div className='flex flex-1 flex-col gap-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter users..."
        searchKey="username"
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Invited", value: "invited" },
              { label: "Suspended", value: "suspended" },
            ],
          },
          {
            columnId: "role",
            title: "Role",
            options: roles.map((role) => ({ ...role })),
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <DataTable table={table} className="min-w-xl" />
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} />
    </div>
  );
}
