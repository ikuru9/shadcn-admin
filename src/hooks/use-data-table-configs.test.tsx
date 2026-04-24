// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { useDataTableConfigs } from "./use-data-table-configs";

describe("useDataTableConfigs", () => {
  it("builds url state params and custom filters from matching columns", () => {
    const { result } = renderHook(() =>
      useDataTableConfigs({
        columns: [
          {
            id: "name",
            accessorKey: "name",
            enableSorting: true,
            meta: {
              customFilterOptions: {
                title: "Name",
                multiple: false,
                options: [{ label: "Alice", value: "alice" }],
              },
            },
          },
          {
            id: "status",
            accessorKey: "status",
            meta: {
              customFilterOptions: {
                title: "Status",
                multiple: true,
                options: [{ label: "Active", value: "active" }],
              },
            },
          },
        ],
        schema: z.object({
          name: z.string(),
          status: z.array(z.string()).optional(),
        }),
        customFilterKeys: ["status"],
        pagination: { defaultPage: 1, defaultPageSize: 20 },
        query: { enabled: true, placeholder: "Search users" },
      }),
    );

    expect(result.current.customFilters).toEqual([
      {
        columnId: "status",
        title: "Status",
        multiple: true,
        options: [{ label: "Active", value: "active" }],
      },
    ]);

    expect(result.current.urlStateParams).toEqual({
      pagination: { defaultPage: 1, defaultPageSize: 20 },
      query: { enabled: true, placeholder: "Search users" },
      sorting: { enabled: true },
      columnFilters: [
        {
          columnId: "status",
          searchKey: "status",
          type: "array",
        },
      ],
      customFilters: [{ key: "status", multiple: true }],
    });
  });

  it("treats wrapped array fields as array filters", () => {
    const { result } = renderHook(() =>
      useDataTableConfigs({
        columns: [
          {
            id: "tags",
            accessorKey: "tags",
            meta: {
              customFilterOptions: {
                title: "Tags",
                multiple: true,
                options: [],
              },
            },
          },
        ],
        schema: z.object({
          tags: z.array(z.string()).optional(),
        }),
      }),
    );

    expect(result.current.urlStateParams.columnFilters).toEqual([
      {
        columnId: "tags",
        searchKey: "tags",
        type: "array",
      },
    ]);
  });
});
