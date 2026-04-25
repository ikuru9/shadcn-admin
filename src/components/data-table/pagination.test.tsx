// @vitest-environment jsdom

import { createContext, useContext } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTablePagination } from "./pagination";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

const SelectContext = createContext<{ onValueChange: (value: string) => void } | null>(null);

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <SelectContext.Provider value={{ onValueChange }}>
      <div data-testid="select" data-value={value}>
        {children}
      </div>
    </SelectContext.Provider>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => {
    const context = useContext(SelectContext);

    return <button onClick={() => context?.onValueChange(value)}>{children}</button>;
  },
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

function createTable(overrides: Partial<any> = {}): any {
  return {
    getState: () => ({ pagination: { pageIndex: 1, pageSize: 20 } }),
    getPageCount: () => 8,
    getCanPreviousPage: () => true,
    getCanNextPage: () => true,
    setPageIndex: vi.fn(),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    setPageSize: vi.fn(),
    ...overrides,
  };
}

describe("DataTablePagination 컴포넌트", () => {
  it("축약된 페이지 번호와 생략 기호를 렌더링한다", () => {
    render(<DataTablePagination table={createTable()} />);

    expect(screen.getAllByText(/Page\s+2\s+of\s+8/)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Go to page 1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Go to page 5/ })).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("페이지를 이동한다", () => {
    const table = createTable();

    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByRole("button", { name: "Go to first page" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to previous page" }));
    fireEvent.click(screen.getByRole("button", { name: /Go to page 3/ }));
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to last page" }));

    expect(table.setPageIndex).toHaveBeenNthCalledWith(1, 0);
    expect(table.previousPage).toHaveBeenCalledTimes(1);
    expect(table.setPageIndex).toHaveBeenNthCalledWith(2, 2);
    expect(table.nextPage).toHaveBeenCalledTimes(1);
    expect(table.setPageIndex).toHaveBeenNthCalledWith(3, 7);
  });

  it("페이지 크기를 변경한다", () => {
    const table = createTable();

    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByRole("button", { name: "30" }));

    expect(table.setPageSize).toHaveBeenCalledWith(30);
  });
});
