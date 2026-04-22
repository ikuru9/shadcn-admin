import { useEffect, useState } from "react";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { DataTable, DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { type NavigateFn, useTableUrlState } from "@/hooks/use-table-url-state";

import { priorities, statuses } from "./data/data";
import type { Task } from "./data/schema";
import { tasksColumns as columns } from "./tasks-columns";
import { DataTableBulkActions } from "./tasks-data-table-bulk-actions";

interface DataTableProps {
  data: Task[];
  search: Record<string, unknown>;
  navigate: NavigateFn;
}

export function TasksTable({ data, search, navigate }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Synced with URL states (updated to match route search schema defaults)
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: "filter" },
    columnFilters: [
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "priority", searchKey: "priority", type: "array" },
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
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue("id")).toLowerCase();
      const title = String(row.getValue("title")).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return `${id},${title}`.includes(searchValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const pageCount = table.getPageCount();
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className='flex flex-1 flex-col gap-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter by title or ID..."
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: statuses,
          },
          {
            columnId: "priority",
            title: "Priority",
            options: priorities,
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
