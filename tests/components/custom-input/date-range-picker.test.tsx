import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { DateRangePicker } from "@/components/custom-input/date-range-picker";

vi.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, disabled, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      data-testid={`input-${placeholder || "default"}`}
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
  Calendar: ({ onSelect }: any) => (
    <div data-testid="calendar">
      <button
        data-testid="calendar-range"
        onClick={() => onSelect({ from: new Date("2023-01-01"), to: new Date("2023-01-02") })}
      >
        Select Range
      </button>
    </div>
  ),
}));

vi.mock("@/lib/formatter", () => ({
  formatDate: (date: Date | null) => (date ? "2023-01-01" : ""),
}));

vi.mock("date-fns", () => ({
  isValid: (date: any) => date === "2023-01-01" || date === "2023-01-02",
  toDate: (date: string) => new Date(date),
}));

vi.mock("lucide-react", () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">📅</div>,
  MinusIcon: () => <div data-testid="minus-icon">−</div>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("DateRangePicker", () => {
  const mockOnChange = vi.fn();
  const mockOnChangeFrom = vi.fn();
  const mockOnChangeTo = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnChangeFrom.mockClear();
    mockOnChangeTo.mockClear();
  });

  it("플레이스홀더와 함께 두 개의 입력 필드를 렌더링합니다", () => {
    render(<DateRangePicker placeholder={{ from: "Start date", to: "End date" }} />);
    expect(screen.getByPlaceholderText("Start date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("End date")).toBeInTheDocument();
  });

  it("형식화된 값을 표시합니다", () => {
    const from = new Date("2023-01-01");
    const to = new Date("2023-01-02");
    render(<DateRangePicker from={from} to={to} />);

    const inputs = screen.getAllByDisplayValue("2023-01-01");
    expect(inputs.length).toBe(2);
  });

  it("유효한 시작 날짜 입력 시 onChangeFrom을 호출합니다", () => {
    render(<DateRangePicker onChangeFrom={mockOnChangeFrom} />);
    const inputs = screen.getAllByTestId(/^input-/);
    const fromInput = inputs[0];

    fireEvent.change(fromInput, { target: { value: "2023-01-01" } });

    expect(mockOnChangeFrom).toHaveBeenCalledWith(new Date("2023-01-01"));
  });

  it("유효한 종료 날짜 입력 시 onChangeTo를 호출합니다", () => {
    render(<DateRangePicker onChangeTo={mockOnChangeTo} />);
    const inputs = screen.getAllByTestId(/^input-/);
    const toInput = inputs[1];

    fireEvent.change(toInput, { target: { value: "2023-01-02" } });

    expect(mockOnChangeTo).toHaveBeenCalledWith(new Date("2023-01-02"));
  });

  it("캘린더에서 날짜 범위를 선택합니다", async () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    const trigger = screen.getByTestId("popover-trigger");

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });

    const calendarButton = screen.getByTestId("calendar-range");
    fireEvent.click(calendarButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      from: new Date("2023-01-01"),
      to: new Date("2023-01-02"),
    });
  });

  it("disabled 속성이 true일 때 비활성화됩니다", () => {
    render(<DateRangePicker disabled={true} />);
    const inputs = screen.getAllByTestId(/^input-/);

    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
