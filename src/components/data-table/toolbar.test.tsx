// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTableToolbar } from "./toolbar";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  InputGroupAddon: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  InputGroupInput: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("./faceted-filter", () => ({
  DataTableFacetedFilter: ({ title }: any) => <div data-testid={`faceted-${title}`}>{title}</div>,
}));

vi.mock("./view-options", () => ({
  DataTableViewOptions: () => <div data-testid="view-options" />,
}));

function createTable(overrides: Partial<any> = {}): any {
  return {
    getState: () => ({ columnFilters: [] }),
    getColumn: () => ({ id: "status" }),
    resetColumnFilters: vi.fn(),
    ...overrides,
  };
}

describe("DataTableToolbar 컴포넌트", () => {
  it("query 입력값을 동기화하고 Enter로 제출한다", () => {
    const onChange = vi.fn();

    render(
      <DataTableToolbar
        table={createTable()}
        query={{ enabled: true, value: "alice", placeholder: "Search users", onChange }}
      />,
    );

    const input = screen.getByPlaceholderText("Search users");
    fireEvent.change(input, { target: { value: "bob" } });
    fireEvent.keyUp(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("bob");
  });

  it("필터와 보기 옵션을 렌더링한다", () => {
    render(
      <DataTableToolbar
        table={createTable()}
        filters={[{ columnId: "status", title: "Status", options: [] }]}
        customFilters={[{ title: "Role", options: [] }]}
      />,
    );

    expect(screen.getByTestId("faceted-Status")).toBeInTheDocument();
    expect(screen.getByTestId("faceted-Role")).toBeInTheDocument();
    expect(screen.getByTestId("view-options")).toBeInTheDocument();
  });

  it("query와 컬럼 필터를 초기화한다", () => {
    const onChange = vi.fn();
    const resetColumnFilters = vi.fn();

    render(
      <DataTableToolbar
        table={createTable({
          getState: () => ({ columnFilters: [{ id: "status", value: "active" }] }),
          resetColumnFilters,
        })}
        query={{ enabled: true, value: "alice", placeholder: "Search users", onChange }}
        filters={[
          {
            columnId: "status",
            title: "Status",
            value: "active",
            onValueChange: vi.fn(),
            options: [],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(onChange).toHaveBeenCalledWith("");
    expect(resetColumnFilters).toHaveBeenCalledTimes(1);
  });
});
