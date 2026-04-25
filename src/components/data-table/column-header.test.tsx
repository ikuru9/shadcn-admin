// @vitest-environment jsdom

import { cloneElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTableColumnHeader } from "./column-header";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ render, children }: any) =>
    render ? cloneElement(render, {}, children) : <button>{children}</button>,
}));

function createColumn(overrides: Partial<any> = {}): any {
  return {
    getCanSort: () => true,
    getIsSorted: () => false,
    getCanHide: () => true,
    toggleSorting: vi.fn(),
    toggleVisibility: vi.fn(),
    ...overrides,
  };
}

describe("DataTableColumnHeader 컴포넌트", () => {
  it("정렬이 꺼져 있으면 제목만 렌더링한다", () => {
    const column = createColumn({ getCanSort: () => false });

    render(<DataTableColumnHeader column={column} title="Status" />);

    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("드롭다운 메뉴에서 정렬 동작을 실행한다", () => {
    const column = createColumn();

    render(<DataTableColumnHeader column={column} title="Status" />);

    fireEvent.click(screen.getByRole("button", { name: /status/i }));
    fireEvent.click(screen.getByRole("button", { name: "Asc" }));
    fireEvent.click(screen.getByRole("button", { name: "Desc" }));
    fireEvent.click(screen.getByRole("button", { name: "Hide" }));

    expect(column.toggleSorting).toHaveBeenNthCalledWith(1, false);
    expect(column.toggleSorting).toHaveBeenNthCalledWith(2, true);
    expect(column.toggleVisibility).toHaveBeenCalledWith(false);
  });

  it("내림차순 컬럼에 정렬 표시를 보여준다", () => {
    const column = createColumn({ getIsSorted: () => "desc" });

    render(<DataTableColumnHeader column={column} title="Status" />);

    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
