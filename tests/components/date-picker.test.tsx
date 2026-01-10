import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DatePicker } from "@/components/date-picker";

// 테스트에서 일관된 날짜 파싱을 위해 date-fns 모킹
vi.mock("date-fns", () => ({
  isValid: (date: string | Date) => {
    try {
      const d = new Date(date);
      return !isNaN(d.getTime()) && d.getFullYear() > 1900 && d.getFullYear() < 2100;
    } catch {
      return false;
    }
  },
  toDate: (date: string | Date) => new Date(date),
  format: (date: Date, format: string) => {
    if (format === "yyyy-MM-dd") {
      return date.toISOString().split("T")[0];
    }
    return date.toISOString();
  },
}));

// 입력 변경 간섭 방지를 위해 use-mask-input 모킹
vi.mock("use-mask-input", () => ({
  withMask: () => vi.fn(),
}));

describe("DatePicker", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("기본 props로 렌더링", () => {
    render(<DatePicker />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Date picker")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pick a date")).toBeInTheDocument();
  });

  it("값과 함께 렌더링", () => {
    const date = new Date("2023-12-25");
    render(<DatePicker value={date} />);
    expect(screen.getByDisplayValue("2023-12-25")).toBeInTheDocument();
  });

  it("커스텀 플레이스홀더로 렌더링", () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByPlaceholderText("Select date")).toBeInTheDocument();
  });

  it("비활성화 상태로 렌더링", () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("캘린더에서 날짜 선택 시 onChange 호출", async () => {
    render(<DatePicker onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input); // 팝오버 열기

    // 캘린더가 나타날 때까지 기다림
    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    // 날짜 버튼 찾기 및 클릭 (오늘 날짜 또는 특정 날짜를 포함하는 data-day 속성이 있는 버튼 찾기)
    const dateButtons = screen.getAllByRole("button", { hidden: true });
    const todayButton = dateButtons.find((button) => {
      const dataDay = button.getAttribute("data-day");
      return dataDay && !button.hasAttribute("disabled");
    });

    expect(todayButton).toBeInTheDocument();
    fireEvent.click(todayButton!);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it("입력 지우기 시 null로 onChange 호출", () => {
    render(<DatePicker value={new Date("2023-12-25")} onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("입력 변경 시 유효한 날짜로 onChange 호출", () => {
    render(<DatePicker onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2023-12-25" } });
    expect(mockOnChange).toHaveBeenCalledWith(new Date("2023-12-25"));
  });

  it("최소 날짜 제약 준수", () => {
    const minDate = new Date("2023-01-01");
    render(<DatePicker min={minDate} onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2022-12-25" } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("최대 날짜 제약 준수", () => {
    const maxDate = new Date("2023-12-31");
    render(<DatePicker max={maxDate} onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2024-01-01" } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("최소/최대 범위 내 유효한 날짜 허용", () => {
    const minDate = new Date("2023-01-01");
    const maxDate = new Date("2023-12-31");
    render(<DatePicker min={minDate} max={maxDate} onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2023-06-15" } });
    expect(mockOnChange).toHaveBeenCalledWith(new Date("2023-06-15"));
  });

  it("value prop 변경 시 입력 값 업데이트", () => {
    const { rerender } = render(<DatePicker value={new Date("2023-12-25")} />);
    expect(screen.getByDisplayValue("2023-12-25")).toBeInTheDocument();

    rerender(<DatePicker value={new Date("2024-01-01")} />);
    expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
  });

  it("커스텀 className 적용", () => {
    render(<DatePicker className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });
});
