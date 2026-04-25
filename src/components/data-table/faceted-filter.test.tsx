// @vitest-environment jsdom

import { cloneElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTableFacetedFilter } from "./faceted-filter";

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/command", () => ({
  Command: ({ children }: any) => <div>{children}</div>,
  CommandEmpty: ({ children }: any) => <div>{children}</div>,
  CommandGroup: ({ children }: any) => <div>{children}</div>,
  CommandInput: (props: any) => <input {...props} />,
  CommandItem: ({ children, onSelect }: any) => <button onClick={onSelect}>{children}</button>,
  CommandList: ({ children }: any) => <div>{children}</div>,
  CommandSeparator: () => <hr />,
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ render, children }: any) =>
    render ? cloneElement(render, {}, children) : <button>{children}</button>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ ...props }: any) => <hr {...props} />,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" "),
}));

function createColumn(overrides: Partial<any> = {}): any {
  return {
    getFilterValue: () => undefined,
    setFilterValue: vi.fn(),
    ...overrides,
  };
}

describe("DataTableFacetedFilter 컴포넌트", () => {
  it("controlled API로 다중 선택 값을 갱신한다", () => {
    function Wrapper() {
      const [value, setValue] = useState<string[]>(["active"]);

      return (
        <DataTableFacetedFilter
          title="Status"
          multiple
          value={value}
          onValueChange={(next) => setValue((next as string[] | undefined) ?? [])}
          options={[
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
          ]}
        />
      );
    }

    render(<Wrapper />);

    fireEvent.click(screen.getByRole("button", { name: /pending/i }));

    expect(screen.getByText(/^2$/)).toBeInTheDocument();
    expect(screen.getByText("Clear filters")).toBeInTheDocument();
  });

  it("단일 선택 값을 컬럼에 반영한다", () => {
    const column = createColumn();

    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        multiple={false}
        options={[{ label: "Active", value: "active" }]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /active/i }));

    expect(column.setFilterValue).toHaveBeenCalledWith("active");
  });

  it("현재 선택을 초기화한다", () => {
    function Wrapper() {
      const [value, setValue] = useState<string[]>(["active", "pending"]);

      return (
        <DataTableFacetedFilter
          title="Status"
          multiple
          value={value}
          onValueChange={(next) => setValue((next as string[] | undefined) ?? [])}
          options={[
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
          ]}
        />
      );
    }

    render(<Wrapper />);

    fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
  });
});
