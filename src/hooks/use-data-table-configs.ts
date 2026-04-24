import { useMemo } from "react";
import type * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";

type ZodSchemaLike = {
  shape?: Record<string, unknown>;
  _zod?: {
    def?: {
      shape?: Record<string, unknown>;
      type?: string;
      in?: unknown;
      out?: unknown;
      innerType?: unknown;
    };
  };
};

type DataTableFilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DataTableUrlStateParams = {
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
  columnFilters?: Array<{
    columnId: string;
    searchKey: string;
    type?: "string" | "array";
    serialize?: (value: unknown) => unknown;
    deserialize?: (value: unknown) => unknown;
  }>;
};

export interface DataTableConfigsParams<TData> {
  columns: Array<ColumnDef<TData, unknown>>;
  schema: ZodSchemaLike;
  customFilterKeys?: string[];
  pagination?: DataTableUrlStateParams["pagination"];
  query?: DataTableUrlStateParams["query"];
}

export interface DataTableConfigsResult {
  urlStateParams: DataTableUrlStateParams;
  customFilters: Array<{
    columnId: string;
    title: string;
    multiple?: boolean;
    options: DataTableFilterOption[];
  }>;
}

const wrapperTypes = new Set(["optional", "nullable", "default", "prefault", "nonoptional", "success", "catch", "readonly"]);

function resolveSchemaShape(schema: ZodSchemaLike) {
  return schema.shape ?? schema._zod?.def?.shape ?? {};
}

function resolveSchemaField(field: unknown): { _zod?: { def?: { type?: string; in?: unknown; out?: unknown; innerType?: unknown } } } | undefined {
  let current = field as typeof field | undefined;
  const seen = new Set<unknown>();

  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const def = (current as { _zod?: { def?: { type?: string; in?: unknown; out?: unknown; innerType?: unknown } } })._zod?.def;
    const type = def?.type;

    if (!type) {
      break;
    }

    if (type === "pipe") {
      current = def.out;
      continue;
    }

    if (wrapperTypes.has(type)) {
      current = def.innerType;
      continue;
    }

    break;
  }

  return current as { _zod?: { def?: { type?: string; in?: unknown; out?: unknown; innerType?: unknown } } } | undefined;
}

function resolveSchemaFieldType(schema: ZodSchemaLike, key: string): "string" | "array" {
  const shape = resolveSchemaShape(schema);
  const field = resolveSchemaField(shape[key]);
  return field?._zod?.def?.type === "array" ? "array" : "string";
}

function resolveColumnId<TData>(column: ColumnDef<TData, unknown>) {
  if (typeof column.id === "string" && column.id !== "") {
    return column.id;
  }

  const accessorKey = (column as { accessorKey?: string }).accessorKey;
  if (typeof accessorKey === "string" && accessorKey !== "") {
    return accessorKey;
  }

  return undefined;
}

function getCustomFilterOptions<TData>(column: ColumnDef<TData, unknown>) {
  return column.meta?.customFilterOptions;
}

export function useDataTableConfigs<TData>({
  columns,
  schema,
  customFilterKeys,
  pagination,
  query,
}: DataTableConfigsParams<TData>): DataTableConfigsResult {
  return useMemo(() => {
    const customFilterKeySet = customFilterKeys?.length ? new Set(customFilterKeys) : undefined;
    const customFilters: DataTableConfigsResult["customFilters"] = [];
    const columnFilters: NonNullable<DataTableUrlStateParams["columnFilters"]> = [];
    const urlCustomFilters: NonNullable<DataTableUrlStateParams["customFilters"]> = [];
    let hasSortableColumn = false;

    for (const column of columns) {
      const columnId = resolveColumnId(column);
      if (!columnId) {
        continue;
      }

      if ((column as { accessorKey?: unknown }).accessorKey && column.enableSorting !== false) {
        hasSortableColumn = true;
      }

      const customFilterOptions = getCustomFilterOptions(column);
      const shouldIncludeCustomFilter = customFilterOptions && (!customFilterKeySet || customFilterKeySet.has(columnId));

      if (!shouldIncludeCustomFilter) {
        continue;
      }

      const type = resolveSchemaFieldType(schema, columnId);

      customFilters.push({
        columnId,
        title: customFilterOptions.title,
        multiple: customFilterOptions.multiple,
        options: customFilterOptions.options ?? [],
      });

      columnFilters.push({
        columnId,
        searchKey: columnId,
        type,
        serialize: customFilterOptions.serialize,
        deserialize: customFilterOptions.deserialize,
      });

      urlCustomFilters.push({
        key: columnId,
        multiple: customFilterOptions.multiple,
      });
    }

    return {
      urlStateParams: {
        pagination,
        query,
        sorting: hasSortableColumn ? { enabled: true } : undefined,
        columnFilters,
        customFilters: urlCustomFilters,
      },
      customFilters,
    };
  }, [columns, customFilterKeys, pagination, query, schema]);
}
