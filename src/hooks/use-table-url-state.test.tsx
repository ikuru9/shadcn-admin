// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";

import { useTableUrlState, type NavigateFn } from "./use-table-url-state";

type SearchRecord = Record<string, unknown>;

function setup(overrides: Partial<Parameters<typeof useTableUrlState>[0]> = {}) {
  let currentSearch = (overrides.search ?? {}) as SearchRecord;

  const props: Parameters<typeof useTableUrlState>[0] = {
    search: currentSearch,
    navigate: (() => undefined) as NavigateFn,
    ...overrides,
  };

  let rerenderHook = (_nextProps: Parameters<typeof useTableUrlState>[0]) => {};

  const navigate = vi.fn<NavigateFn>(({ search }) => {
    if (search === true) {
      rerenderHook({ ...props, search: currentSearch, navigate });
      return;
    }

    currentSearch = typeof search === "function" ? ((search(currentSearch) as SearchRecord) ?? {}) : search;
    rerenderHook({ ...props, search: currentSearch, navigate });
  });

  props.navigate = navigate;

  const hook = renderHook((nextProps: Parameters<typeof useTableUrlState>[0]) => useTableUrlState(nextProps), {
    initialProps: props,
  });

  rerenderHook = hook.rerender;

  return {
    ...hook,
    navigate,
    getSearch: () => currentSearch,
  };
}

describe("useTableUrlState", () => {
  it("search 값에서 table state를 읽는다", () => {
    const { result } = setup({
      search: {
        page: 3,
        pageSize: 25,
        sort: "name",
        order: "desc",
        query: "kim",
        status: ["active", "pending"],
        name: "Alice",
        role: ["admin"],
      },
      sorting: { enabled: true },
      query: { enabled: true, placeholder: "Search users" },
      customFilters: [{ key: "status", multiple: true }],
      columnFilters: [
        { columnId: "name", searchKey: "name", type: "string" },
        { columnId: "role", searchKey: "role", type: "array" },
      ],
    });

    expect(result.current.sorting).toEqual([{ id: "name", desc: true }]);
    expect(result.current.queryValue).toBe("kim");
    expect(result.current.queryPlaceholder).toBe("Search users");
    expect(result.current.customFilters).toEqual([
      expect.objectContaining({ key: "status", multiple: true, value: ["active", "pending"] }),
    ]);
    expect(result.current.columnFilters).toEqual([
      { id: "name", value: "Alice" },
      { id: "role", value: ["admin"] },
    ]);
    expect(result.current.pagination).toEqual({ pageIndex: 2, pageSize: 25 });
  });

  it("pagination 변경 시 1-based page를 쓰고 기본값은 제거한다", () => {
    const { result, navigate, getSearch } = setup({
      search: { page: 4, pageSize: 30 },
      pagination: { defaultPage: 1, defaultPageSize: 10 },
    });

    act(() => {
      result.current.onPaginationChange({ pageIndex: 0, pageSize: 10 });
    });

    expect(navigate).toHaveBeenLastCalledWith({
      search: expect.any(Function),
    });
    expect(getSearch()).toEqual({ page: undefined, pageSize: undefined });

    act(() => {
      result.current.onPaginationChange({ pageIndex: 2, pageSize: 20 });
    });

    expect(getSearch()).toEqual({ page: 3, pageSize: 20 });
  });

  it("sorting, query, custom filter 변경 시 page를 초기화하고 search를 갱신한다", () => {
    const { result, getSearch } = setup({
      search: { page: 5, query: " old ", status: "active" },
      sorting: { enabled: true, sortKey: "sortBy", orderKey: "direction" },
      query: { enabled: true, trim: true },
      customFilters: [{ key: "status" }, { key: "disabled", enabled: false }],
    });

    act(() => {
      result.current.onSortingChange([{ id: "email", desc: false }]);
    });
    expect(getSearch()).toEqual({ page: 1, query: " old ", status: "active", sortBy: "email", direction: "asc" });

    act(() => {
      result.current.onQueryChange?.("  alice  ");
    });
    expect(getSearch()).toEqual({
      page: undefined,
      query: "alice",
      status: "active",
      sortBy: "email",
      direction: "asc",
    });

    act(() => {
      result.current.customFilters[0]?.onValueChange("pending");
    });
    expect(getSearch()).toEqual({
      page: undefined,
      query: "alice",
      status: "pending",
      sortBy: "email",
      direction: "asc",
    });

    act(() => {
      result.current.customFilters[1]?.onValueChange("ignored");
    });
    expect(getSearch()).toEqual({
      page: undefined,
      query: "alice",
      status: "pending",
      sortBy: "email",
      direction: "asc",
    });
  });

  it("column filter 변경 시 serialize 하고 비어 있는 값은 제거한다", () => {
    const { result, getSearch } = setup({
      search: { page: 4, name: "Alice", tags: ["dev"] },
      columnFilters: [
        {
          columnId: "name",
          searchKey: "name",
          type: "string",
          serialize: (value) => String(value).toUpperCase(),
        },
        {
          columnId: "tags",
          searchKey: "tags",
          type: "array",
          serialize: (value) => (value as string[]).map((item) => item.toUpperCase()),
        },
      ],
    });

    const nextFilters: ColumnFiltersState = [
      { id: "name", value: "bob" },
      { id: "tags", value: ["admin", "staff"] },
    ];

    act(() => {
      result.current.onColumnFiltersChange(nextFilters);
    });

    expect(result.current.columnFilters).toEqual(nextFilters);
    expect(getSearch()).toEqual({ page: undefined, name: "BOB", tags: ["ADMIN", "STAFF"] });

    act(() => {
      result.current.onColumnFiltersChange([]);
    });

    expect(getSearch()).toEqual({ page: undefined, name: undefined, tags: undefined });
  });

  it("ensurePageInRange는 범위를 벗어난 page만 교정한다", () => {
    const firstPageReset = setup({
      search: { page: 6, pageSize: 20 },
    });

    act(() => {
      firstPageReset.result.current.ensurePageInRange(3);
    });

    expect(firstPageReset.navigate).toHaveBeenLastCalledWith({
      replace: true,
      search: expect.any(Function),
    });
    expect(firstPageReset.getSearch()).toEqual({ page: undefined, pageSize: 20 });

    const lastPageReset = setup({
      search: { page: 6, pageSize: 20 },
    });

    act(() => {
      lastPageReset.result.current.ensurePageInRange(3, { resetTo: "last" });
    });

    expect(lastPageReset.getSearch()).toEqual({ page: 3, pageSize: 20 });

    const beforeCalls = lastPageReset.navigate.mock.calls.length;

    act(() => {
      lastPageReset.result.current.ensurePageInRange(3);
    });

    expect(lastPageReset.navigate).toHaveBeenCalledTimes(beforeCalls);
  });
});
