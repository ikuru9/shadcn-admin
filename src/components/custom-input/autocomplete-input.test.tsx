import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { AutoComplete, type Option } from "@/components/custom-input/autocomplete-input";

vi.mock("@/components/ui/command", () => ({
  CommandGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="command-group">{children}</div>,
  CommandItem: ({ children, onSelect, ...props }: any) => (
    <div data-testid="command-item" onClick={onSelect} {...props}>
      {children}
    </div>
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => <div data-testid="command-list">{children}</div>,
  CommandInput: ({ ref, ...props }: any) => <input ref={ref} data-testid="command-input" {...props} />,
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

vi.mock("lucide-react", () => ({
  Check: () => <div data-testid="check-icon">✓</div>,
}));

vi.mock("cmdk", () => {
  const Command = ({ children, onKeyDown }: any) => (
    <div data-testid="command-primitive" onKeyDown={onKeyDown}>
      {children}
    </div>
  );

  Command.Loading = ({ children }: any) => <div data-testid="loading">{children}</div>;

  Command.Empty = ({ children }: any) => <div data-testid="empty">{children}</div>;

  return { Command };
});

vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("AutoComplete", () => {
  const mockOptions: Option[] = [
    { value: "1", label: "Apple" },
    { value: "2", label: "Banana" },
    { value: "3", label: "Cherry" },
  ];

  const defaultProps = {
    options: mockOptions,
    emptyMessage: "No options found",
  };

  it("플레이스홀더와 함께 입력 필드를 렌더링합니다", () => {
    render(<AutoComplete {...defaultProps} placeholder="Search fruits..." />);
    expect(screen.getByPlaceholderText("Search fruits...")).toBeInTheDocument();
  });

  it("포커스 시 옵션을 표시합니다", async () => {
    render(<AutoComplete {...defaultProps} />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("선택된 옵션에 체크 아이콘을 표시합니다", async () => {
    const mockOnValueChange = vi.fn();
    render(<AutoComplete {...defaultProps} value={mockOptions[0]} onValueChange={mockOnValueChange} />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    const firstItem = screen.getAllByTestId("command-item")[0];
    expect(firstItem).toContainElement(screen.getByTestId("check-icon"));
  });

  it("옵션 선택 시 onValueChange를 호출합니다", async () => {
    const mockOnValueChange = vi.fn();
    render(<AutoComplete {...defaultProps} onValueChange={mockOnValueChange} />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    const secondOption = screen.getByText("Banana");
    fireEvent.click(secondOption);

    expect(mockOnValueChange).toHaveBeenCalledWith(mockOptions[1]);
  });

  it("키보드 Enter로 정확히 일치하는 항목을 선택합니다", () => {
    const mockOnValueChange = vi.fn();
    render(<AutoComplete {...defaultProps} onValueChange={mockOnValueChange} value={mockOptions[0]} />);
    const commandPrimitive = screen.getByTestId("command-primitive");

    fireEvent.keyDown(commandPrimitive, { key: "Enter" });

    expect(mockOnValueChange).toHaveBeenCalledWith(mockOptions[0]);
  });

  it("Escape 키로 입력 필드의 포커스를 해제합니다", () => {
    render(<AutoComplete {...defaultProps} />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "Escape" });

    expect(document.activeElement).not.toBe(input);
  });

  it("isPending이 true일 때 스켈레톤을 표시합니다", async () => {
    render(<AutoComplete {...defaultProps} isPending={true} />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("옵션이 없고 대기 중이 아닐 때 빈 메시지를 표시합니다", async () => {
    render(<AutoComplete options={[]} emptyMessage="No fruits found" />);
    const input = screen.getByTestId("command-input");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    expect(screen.getByText("No fruits found")).toBeInTheDocument();
  });

  it("disabled prop가 true일 때 비활성화됩니다", () => {
    render(<AutoComplete {...defaultProps} disabled={true} />);
    const input = screen.getByTestId("command-input");

    expect(input).toBeDisabled();
  });

  it("readOnly prop가 true일 때 읽기 전용 상태가 됩니다", () => {
    render(<AutoComplete {...defaultProps} readOnly={true} />);
    const input = screen.getByTestId("command-input");

    expect(input).toHaveAttribute("readOnly");
  });
});
