// @vitest-environment jsdom

import { cloneElement } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTableBulkActions } from "./bulk-actions";

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ ...props }: any) => <hr {...props} />,
}));

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ render, children }: any) =>
    render ? cloneElement(render, {}, children) : <button>{children}</button>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" "),
}));

function createTable(overrides: Partial<any> = {}): any {
  return {
    getFilteredSelectedRowModel: () => ({ rows: [{ id: "row-1" }] }),
    resetRowSelection: vi.fn(),
    ...overrides,
  };
}

describe("DataTableBulkActions 컴포넌트", () => {
  it("선택된 행이 없으면 렌더링하지 않는다", () => {
    render(
      <DataTableBulkActions
        table={createTable({ getFilteredSelectedRowModel: () => ({ rows: [] }) })}
        entityName="task"
      >
        <button>Delete</button>
      </DataTableBulkActions>,
    );

    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("선택 상태를 안내하고 툴바에서 선택을 해제한다", async () => {
    const table = createTable();

    render(
      <DataTableBulkActions table={table} entityName="task">
        <button>Delete</button>
      </DataTableBulkActions>,
    );

    await waitFor(() => {
      expect(screen.getByText("1 task selected. Bulk actions toolbar is available.")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /clear selection/i }));

    expect(table.resetRowSelection).toHaveBeenCalledTimes(1);
  });

  it("키보드 이동과 Escape로 선택을 해제한다", () => {
    const table = createTable();

    render(
      <DataTableBulkActions table={table} entityName="task">
        <button>First action</button>
        <button>Second action</button>
      </DataTableBulkActions>,
    );

    const toolbar = screen.getByRole("toolbar");
    const firstAction = screen.getByRole("button", { name: "First action" });
    const secondAction = screen.getByRole("button", { name: "Second action" });

    firstAction.focus();
    fireEvent.keyDown(toolbar, { key: "ArrowRight" });
    expect(secondAction).toHaveFocus();

    fireEvent.keyDown(toolbar, { key: "Escape" });
    expect(table.resetRowSelection).toHaveBeenCalledTimes(1);
  });
});
