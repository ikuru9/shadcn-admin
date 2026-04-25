// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./data-table";

vi.mock("@/components/ui/table", () => ({
  Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
  TableHeader: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
  TableBody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableHead: ({ children, ...props }: any) => <th {...props}>{children}</th>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" "),
}));

function createTable(overrides: Partial<any> = {}): any {
  const column = {
    id: "name",
    columnDef: {
      header: "Name",
      cell: "Alice",
      meta: {
        className: "cell-class",
        thClassName: "head-class",
        tdClassName: "td-class",
      },
    },
  };

  const cell = {
    id: "cell-1",
    column,
    getContext: () => ({}),
  };

  const row = {
    id: "row-1",
    getIsSelected: () => true,
    getVisibleCells: () => [cell],
  };

  const header = {
    id: "header-1",
    colSpan: 1,
    isPlaceholder: false,
    column,
    getContext: () => ({}),
  };

  return {
    getHeaderGroups: () => [{ id: "group-1", headers: [header] }],
    getAllColumns: () => [column],
    getRowModel: () => ({ rows: [row] }),
    ...overrides,
  };
}

describe("DataTable 컴포넌트", () => {
  it("헤더, 셀, 선택된 행 상태를 렌더링한다", () => {
    render(<DataTable table={createTable()} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Alice/ })).toHaveAttribute("data-state", "selected");
  });

  it("행이 없으면 빈 상태를 렌더링한다", () => {
    render(
      <DataTable
        table={createTable({
          getRowModel: () => ({ rows: [] }),
        })}
      />,
    );

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("customProps로 행과 셀 이벤트 핸들러를 전달한다", () => {
    const rowClick = vi.fn();
    const cellClick = vi.fn();
    const table = createTable();

    render(
      <DataTable
        table={table}
        customProps={{
          row: {
            onClick: rowClick,
          },
          cell: {
            name: {
              onClick: cellClick,
            },
          },
        }}
      />,
    );

    fireEvent.click(screen.getByText("Alice"));

    expect(cellClick).toHaveBeenCalledTimes(1);
    expect(rowClick).toHaveBeenCalledTimes(1);
    expect(cellClick.mock.calls[0][1].id).toBe("cell-1");
    expect(rowClick.mock.calls[0][1].id).toBe("row-1");
  });
});
