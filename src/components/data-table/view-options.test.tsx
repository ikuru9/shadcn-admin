// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTableViewOptions } from "./view-options";

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuCheckboxItem: ({ children, checked, onCheckedChange }: any) => (
    <button aria-pressed={checked} onClick={() => onCheckedChange?.(!checked)}>
      {children}
    </button>
  ),
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ children }: any) => <button>{children}</button>,
}));

vi.mock("@/components/ui/button", () => ({
  buttonVariants: () => "",
}));

function createTable(overrides: Partial<any> = {}): any {
  const visible = vi.fn();
  const columns = [
    {
      id: "name",
      accessorFn: () => "name",
      getCanHide: () => true,
      getIsVisible: () => true,
      toggleVisibility: visible,
    },
    {
      id: "status",
      accessorFn: undefined,
      getCanHide: () => true,
      getIsVisible: () => true,
      toggleVisibility: vi.fn(),
    },
    {
      id: "email",
      accessorFn: () => "email",
      getCanHide: () => false,
      getIsVisible: () => true,
      toggleVisibility: vi.fn(),
    },
  ];

  return {
    getAllColumns: () => columns,
    ...overrides,
  };
}

describe("DataTableViewOptions 컴포넌트", () => {
  it("숨길 수 있는 accessor 컬럼만 보여준다", () => {
    render(<DataTableViewOptions table={createTable()} />);

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.queryByText("status")).not.toBeInTheDocument();
    expect(screen.queryByText("email")).not.toBeInTheDocument();
  });

  it("컬럼 표시 여부를 토글한다", () => {
    const table = createTable();

    render(<DataTableViewOptions table={table} />);

    fireEvent.click(screen.getByRole("button", { name: "name" }));

    expect(table.getAllColumns()[0].toggleVisibility).toHaveBeenCalledWith(false);
  });
});
