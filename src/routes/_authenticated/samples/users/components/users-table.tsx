import { useEffect, useState } from "react";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    sorting,
    onSortingChange,
    queryValue,
    queryPlaceholder,
    onQueryChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    sorting: { enabled: true },
    query: { enabled: true, key: "username", placeholder: "Filter users..." },
    columnFilters: [
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "role", searchKey: "role", type: "array" },
    ],
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter: queryValue,
      pagination,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const username = String(row.getValue("username")).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return username.includes(searchValue);
    },
  });

  const pageCount = table.getPageCount();

  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className={'flex flex-1 flex-col gap-4 max-sm:has-[div[role="toolbar"]]:mb-16'}>
      <DataTableToolbar
        table={table}
        query={{ enabled: true, value: queryValue ?? "", placeholder: queryPlaceholder, onChange: onQueryChange }}
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
