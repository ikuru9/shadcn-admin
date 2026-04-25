import type { Cell, Column, Row } from "@tanstack/react-table";

type MockTableState = {
  columnFilters?: Array<unknown>;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
};

export function createMockRow<TData>(overrides: Partial<Row<TData>> = {}) {
  return {
    id: "row-1",
    getIsSelected: () => false,
    getVisibleCells: () => [],
    ...overrides,
  } as Row<TData>;
}

export function createMockCell<TData>(overrides: Partial<Cell<TData, unknown>> = {}) {
  return {
    id: "cell-1",
    column: {
      id: "column-1",
      columnDef: {},
    },
    getContext: () => ({}),
    ...overrides,
  } as Cell<TData, unknown>;
}

export function createMockColumn<TData, TValue>(overrides: Partial<Column<TData, TValue>> = {}) {
  return {
    id: "column-1",
    accessorFn: () => undefined,
    getCanHide: () => true,
    getIsVisible: () => true,
    toggleVisibility: () => undefined,
    getCanSort: () => false,
    getIsSorted: () => false,
    toggleSorting: () => undefined,
    setFilterValue: () => undefined,
    getFilterValue: () => undefined,
    ...overrides,
  } as Column<TData, TValue>;
}

export function createMockTable<TTable extends Record<string, unknown>>(overrides: Partial<TTable> = {}) {
  const state: MockTableState = {
    columnFilters: [],
    pagination: { pageIndex: 0, pageSize: 10 },
  };

  return {
    getState: () => state,
    getHeaderGroups: () => [],
    getAllColumns: () => [],
    getRowModel: () => ({ rows: [] }),
    getFilteredSelectedRowModel: () => ({ rows: [] }),
    getColumn: () => undefined,
    getPageCount: () => 1,
    getCanPreviousPage: () => false,
    getCanNextPage: () => false,
    resetColumnFilters: () => undefined,
    resetRowSelection: () => undefined,
    previousPage: () => undefined,
    nextPage: () => undefined,
    setPageIndex: () => undefined,
    setPageSize: () => undefined,
    ...overrides,
  } as unknown as TTable;
}
