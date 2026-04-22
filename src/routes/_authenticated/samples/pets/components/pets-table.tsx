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
import { pascalCase } from "es-toolkit";

import { DataTable, DataTablePagination, DataTableToolbar } from "@/components/data-table";
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    columnFilters: [{ columnId: "status", searchKey: "status", type: "array" }],
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
      const name = String(row.getValue("name")).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return `${id},${name}`.includes(searchValue);
    },
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const pageCount = table.getPageCount();
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className={'flex flex-1 flex-col gap-4 max-sm:has-[div[role="toolbar"]]:mb-16'}>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter pets ID or name..."
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: Object.entries(petStatusEnum).map(([value, label]) => ({ value, label: pascalCase(label) })),
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
