import type * as React from "react";
import { useEffect, useState } from "react";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  query?: {
    enabled?: boolean;
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
  };
  filters?: Array<{
    columnId: string;
    title: string;
    multiple?: boolean;
    value?: string | string[];
    onValueChange?: (value: string | string[] | undefined) => void;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }>;
  customFilters?: Array<{
    title: string;
    multiple?: boolean;
    value?: string | string[];
    onValueChange?: (value: string | string[] | undefined) => void;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }>;
}

export function DataTableToolbar<TData>({
  table,
  filters = [],
  customFilters = [],
  query,
}: DataTableToolbarProps<TData>) {
  const [queryInput, setQueryInput] = useState(query?.value ?? "");

  useEffect(() => {
    setQueryInput(query?.value ?? "");
  }, [query?.value]);

  const hasControlledFilter = [...filters, ...customFilters].some((filter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.length > 0;
    }

    return typeof filter.value === "string" && filter.value !== "";
  });

  const isFiltered =
    table.getState().columnFilters.length > 0 || hasControlledFilter || (query?.enabled && (query.value ?? "") !== "");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {query?.enabled && (
          <InputGroup className="h-8 w-37.5 lg:w-62.5">
            <InputGroupInput
              placeholder={query.placeholder ?? "Filter..."}
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              onKeyUpCapture={(event) => {
                if (event.key !== "Enter") {
                  return;
                }

                event.stopPropagation();
                query.onChange?.(queryInput);
              }}
            />
            {queryInput.length > 0 && (
              <InputGroupAddon align="inline-end">
                <X
                  className="ms-2 h-4 w-4 cursor-pointer"
                  onClick={() => {
                    setQueryInput("");
                    query.onChange?.("");
                  }}
                />
              </InputGroupAddon>
            )}
          </InputGroup>
        )}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                multiple={filter.multiple}
                value={filter.value}
                onValueChange={filter.onValueChange}
                options={filter.options}
              />
            );
          })}
          {customFilters.map((filter) => (
            <DataTableFacetedFilter
              key={filter.title}
              title={filter.title}
              multiple={filter.multiple}
              value={filter.value}
              onValueChange={filter.onValueChange}
              options={filter.options}
            />
          ))}
        </div>
      </div>

      {isFiltered && (
        <Button
          variant="secondary"
          onClick={() => {
            if (query?.enabled && query.onChange) {
              query.onChange("");
            }
            for (const filter of filters) {
              filter.onValueChange?.(undefined);
            }
            for (const filter of customFilters) {
              filter.onValueChange?.(undefined);
            }
            table.resetColumnFilters();
          }}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ms-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
