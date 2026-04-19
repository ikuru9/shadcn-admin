import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { DatePicker } from "@/components/custom-input/date-picker";

vi.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, disabled, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="date-input"
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children, open }: any) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  ),
  PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ children, ...props }: any) => (
    <div data-testid="popover-trigger" {...props}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect, disabled }: any) => (
    <div data-testid="calendar">
      <button
        data-testid="calendar-date"
        onClick={() => onSelect(new Date("2023-01-01"))}
        disabled={disabled?.(new Date("2023-01-01"))}
      >
        Select Date
      </button>
    </div>
  ),
}));

vi.mock("@/lib/formatter", () => ({
  formatDate: (date: Date | null) => (date ? "2023-01-01" : ""),
}));

vi.mock("use-mask-input", () => ({
  withMask: () => () => {},
}));

vi.mock("date-fns", () => ({
  isValid: (date: any) => date === "2023-01-01",
  toDate: (date: string) => new Date(date),
}));

vi.mock("lucide-react", () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">📅</div>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("DatePicker", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("플레이스홀더와 함께 입력 필드를 렌더링합니다", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByPlaceholderText("Pick a date")).toBeInTheDocument();
  });

  it("형식화된 값을 표시합니다", () => {
    const value = new Date("2023-01-01");
    render(<DatePicker value={value} />);
    expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();
  });

  it("유효한 날짜 입력 시 onChange를 호출합니다", () => {
    render(<DatePicker onChange={mockOnChange} />);
    const input = screen.getByTestId("date-input");

    fireEvent.change(input, { target: { value: "2023-01-01" } });

    expect(mockOnChange).toHaveBeenCalledWith(new Date("2023-01-01"));
  });

  it("유효하지 않은 날짜 입력 시 onChange를 호출하지 않습니다", () => {
    render(<DatePicker onChange={mockOnChange} />);
    const input = screen.getByTestId("date-input");

    fireEvent.change(input, { target: { value: "invalid-date" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("입력 필드가 비어있을 때 값을 초기화합니다", () => {
    render(<DatePicker onChange={mockOnChange} value={new Date("2023-01-01")} />);
    const input = screen.getByTestId("date-input");

    fireEvent.change(input, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("트리거를 클릭하면 캘린더를 엽니다", async () => {
    render(<DatePicker />);
    const trigger = screen.getByTestId("popover-trigger");

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });
  });

  it("캘린더에서 날짜를 선택합니다", async () => {
    render(<DatePicker onChange={mockOnChange} />);
    const trigger = screen.getByTestId("popover-trigger");

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });

    const calendarButton = screen.getByTestId("calendar-date");
    fireEvent.click(calendarButton);

    expect(mockOnChange).toHaveBeenCalledWith(new Date("2023-01-01"));
  });

  it("최소 날짜 제약 조건을 준수합니다", () => {
    const minDate = new Date("2023-01-02");
    render(<DatePicker onChange={mockOnChange} min={minDate} />);
    const input = screen.getByTestId("date-input");

    fireEvent.change(input, { target: { value: "2023-01-01" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("최대 날짜 제약 조건을 준수합니다", () => {
    const maxDate = new Date("2022-12-31");
    render(<DatePicker onChange={mockOnChange} max={maxDate} />);
    const input = screen.getByTestId("date-input");

    fireEvent.change(input, { target: { value: "2023-01-01" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("disabled 속성이 true일 때 비활성화됩니다", () => {
    render(<DatePicker disabled={true} />);
    const input = screen.getByTestId("date-input");

    expect(input).toBeDisabled();
  });
});
