import { useCallback, useMemo, useState } from "react";

import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";

type SearchRecord = Record<string, unknown>;
type SearchUpdaterResult = Partial<SearchRecord> | SearchRecord;

export type NavigateFn = (opts: {
  search: true | SearchRecord | ((prev: SearchRecord) => SearchUpdaterResult);
  replace?: boolean;
}) => void;

type ColumnFilter =
  | {
      columnId: string;
      searchKey: string;
      type?: "string";
      // Optional transformers for custom types
      serialize?: (value: unknown) => unknown;
      deserialize?: (value: unknown) => unknown;
    }
  | {
      columnId: string;
      searchKey: string;
      type: "array";
      serialize?: (value: unknown) => unknown;
      deserialize?: (value: unknown) => unknown;
    };

interface UseTableUrlStateParams {
  search: SearchRecord;
  navigate: NavigateFn;
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  sorting?: {
    enabled?: boolean;
    sortKey?: string;
    orderKey?: string;
  };
  query?: {
    enabled?: boolean;
    key?: string;
    value?: string;
    trim?: boolean;
    placeholder?: string;
  };
  customFilters?: Array<{
    key: string;
    enabled?: boolean;
    multiple?: boolean;
    value?: string | string[];
  }>;
  columnFilters?: ColumnFilter[];
}

interface UseTableUrlStateReturn {
  // Sorting
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  // Query
  queryValue?: string;
  queryPlaceholder?: string;
  onQueryChange?: (value: string) => void;
  // Custom filters
  customFilters: Array<{
    key: string;
    multiple?: boolean;
    value: string | string[];
    onValueChange: (value: string | string[] | undefined) => void;
  }>;
  // Column filters
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  // Pagination
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  // Helpers
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: "first" | "last" }) => void;
}

const identity = <T>(value: T) => value;

function getNextState<T>(updater: T | ((prev: T) => T), current: T): T {
  if (typeof updater !== "function") {
    return updater;
  }

  return (updater as (prev: T) => T)(current);
}

export function useDataTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const {
    search,
    navigate,
    pagination: paginationCfg,
    sorting: sortingCfg,
    query: queryCfg,
    customFilters: customFiltersCfg = [],
    columnFilters: columnFiltersCfg = [],
  } = params;

  const pageKey = paginationCfg?.pageKey ?? ("page" as string);
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ("pageSize" as string);
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

  const sortKey = sortingCfg?.sortKey ?? ("sort" as string);
  const orderKey = sortingCfg?.orderKey ?? ("order" as string);
  const sortingEnabled = sortingCfg?.enabled ?? false;

  const queryEnabled = queryCfg?.enabled ?? false;
  const queryKey = queryCfg?.key ?? "query";
  const queryTrim = queryCfg?.trim ?? true;
  const queryPlaceholder = queryCfg?.placeholder ?? "Filter...";
  const searchRecord = search as SearchRecord;

  const updateSearch = useCallback(
    (patch: SearchUpdaterResult, replace?: boolean) => {
      navigate({
        replace,
        search: (prev) => ({
          ...(prev as SearchRecord),
          ...patch,
        }),
      });
    },
    [navigate],
  );

  const sorting: SortingState = useMemo(() => {
    if (!sortingEnabled) {
      return [];
    }

    const rawSort = searchRecord[sortKey];
    const rawOrder = searchRecord[orderKey];

    if (typeof rawSort !== "string") {
      return [];
    }

    if (rawOrder !== "asc" && rawOrder !== "desc") {
      return [];
    }

    return [{ id: rawSort, desc: rawOrder === "desc" }];
  }, [orderKey, searchRecord, sortKey, sortingEnabled]);

  const queryValue = useMemo(() => {
    if (!queryEnabled) {
      return undefined;
    }

    const raw = queryCfg?.value ?? searchRecord[queryKey];
    if (typeof raw !== "string") {
      return "";
    }

    return raw;
  }, [queryCfg?.value, queryEnabled, queryKey, searchRecord]);

  const customFilters = useMemo(
    () =>
      customFiltersCfg.map((cfg) => {
        const raw = cfg.value ?? searchRecord[cfg.key];
        const value = cfg.multiple ? (Array.isArray(raw) ? raw : []) : typeof raw === "string" ? raw : "";

        return {
          key: cfg.key,
          multiple: cfg.multiple,
          value,
          onValueChange: (nextValue: string | string[] | undefined) => {
            if (cfg.enabled === false) {
              return;
            }

            updateSearch({
              [pageKey]: undefined,
              [cfg.key]: nextValue,
            });
          },
        };
      }),
    [customFiltersCfg, pageKey, searchRecord, updateSearch],
  );

  // Build initial column filters from the current search params
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = searchRecord[cfg.searchKey];
      const deserialize = cfg.deserialize ?? identity;
      if (cfg.type === "string") {
        const value = (deserialize(raw) as string) ?? "";
        if (typeof value === "string" && value.trim() !== "") {
          collected.push({ id: cfg.columnId, value });
        }
      } else {
        // default to array type
        const value = (deserialize(raw) as unknown[]) ?? [];
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value });
        }
      }
    }
    return collected;
  }, [columnFiltersCfg, searchRecord]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  const pagination: PaginationState = useMemo(() => {
    const rawPage = searchRecord[pageKey];
    const rawPageSize = searchRecord[pageSizeKey];
    const pageNum = typeof rawPage === "number" ? rawPage : defaultPage;
    const pageSizeNum = typeof rawPageSize === "number" ? rawPageSize : defaultPageSize;
    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
  }, [searchRecord, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = getNextState(updater, pagination);
    const nextPage = next.pageIndex + 1;
    const nextPageSize = next.pageSize;
    updateSearch({
      [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
      [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : nextPageSize,
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (!sortingEnabled) {
      return;
    }

    const next = getNextState(updater, sorting);
    const first = next[0];

    updateSearch({
      [pageKey]: defaultPage,
      [sortKey]: first?.id,
      [orderKey]: first ? (first.desc ? "desc" : "asc") : undefined,
    });
  };

  const onQueryChange = queryEnabled
    ? (value: string) => {
        const next = queryTrim ? value.trim() : value;
        updateSearch({
          [pageKey]: undefined,
          [queryKey]: next ? next : undefined,
        });
      }
    : undefined;

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = getNextState(updater, columnFilters);
    setColumnFilters(next);

    const patch: Record<string, unknown> = {};

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId);
      const serialize = cfg.serialize ?? identity;
      if (cfg.type === "string") {
        const value = typeof found?.value === "string" ? (found.value as string) : "";
        patch[cfg.searchKey] = value.trim() !== "" ? serialize(value) : undefined;
      } else {
        const value = Array.isArray(found?.value) ? (found.value as unknown[]) : [];
        patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined;
      }
    }

    updateSearch({
      [pageKey]: undefined,
      ...patch,
    });
  };

  const ensurePageInRange = (pageCount: number, opts: { resetTo?: "first" | "last" } = { resetTo: "first" }) => {
    const currentPage = searchRecord[pageKey];
    const pageNum = typeof currentPage === "number" ? currentPage : defaultPage;
    if (pageCount > 0 && pageNum > pageCount) {
      updateSearch(
        {
          [pageKey]: opts.resetTo === "last" ? pageCount : undefined,
        },
        true,
      );
    }
  };

  return {
    sorting,
    onSortingChange,
    queryValue,
    queryPlaceholder,
    onQueryChange,
    customFilters,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  };
}
