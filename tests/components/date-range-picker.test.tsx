import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DateRangePicker } from "@/components/date-range-picker";

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

describe("DateRangePicker", () => {
  const mockOnChange = vi.fn();
  const mockOnChangeFrom = vi.fn();
  const mockOnChangeTo = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnChangeFrom.mockClear();
    mockOnChangeTo.mockClear();
  });

  it("기본 props로 렌더링", () => {
    render(<DateRangePicker />);
    expect(screen.getByLabelText("From Date picker")).toBeInTheDocument();
    expect(screen.getByLabelText("To Date picker")).toBeInTheDocument();
    // 구분선 아이콘이 렌더링되는지 확인
    const separatorIcon = document.querySelector("svg");
    expect(separatorIcon).toBeInTheDocument();
  });

  it("값과 함께 렌더링", () => {
    const fromDate = new Date("2023-12-01");
    const toDate = new Date("2023-12-31");
    render(<DateRangePicker from={fromDate} to={toDate} />);
    expect(screen.getByDisplayValue("2023-12-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-12-31")).toBeInTheDocument();
  });

  it("커스텀 플레이스홀더로 렌더링", () => {
    render(<DateRangePicker placeholder={{ from: "시작 날짜", to: "종료 날짜" }} />);
    expect(screen.getByPlaceholderText("시작 날짜")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("종료 날짜")).toBeInTheDocument();
  });

  it("비활성화 상태로 렌더링", () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByLabelText("From Date picker")).toBeDisabled();
    expect(screen.getByLabelText("To Date picker")).toBeDisabled();
  });

  it("캘린더에서 범위 선택 시 onChange 호출", async () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.click(fromInput); // 팝오버 열기

    // 캘린더가 나타날 때까지 기다림
    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    // 첫 번째 날짜 선택
    const dateButtons = screen.getAllByRole("button", { hidden: true });
    const firstButton = dateButtons.find((button) => {
      const dataDay = button.getAttribute("data-day");
      return dataDay && !button.hasAttribute("disabled");
    });

    expect(firstButton).toBeInTheDocument();
    fireEvent.click(firstButton!);

    // 두 번째 날짜 선택 (다음 날짜)
    const nextDateButtons = screen.getAllByRole("button", { hidden: true });
    const secondButton = nextDateButtons.find((button) => {
      const dataDay = button.getAttribute("data-day");
      return dataDay && !button.hasAttribute("disabled") && button !== firstButton;
    });

    expect(secondButton).toBeInTheDocument();
    fireEvent.click(secondButton!);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(Date),
        to: expect.any(Date),
      }),
    );
  });

  it("from 입력 변경 시 onChangeFrom 호출", () => {
    render(<DateRangePicker onChangeFrom={mockOnChangeFrom} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.change(fromInput, { target: { value: "2023-12-01" } });
    expect(mockOnChangeFrom).toHaveBeenCalledWith(new Date("2023-12-01"));
  });

  it("to 입력 변경 시 onChangeTo 호출", () => {
    render(<DateRangePicker onChangeTo={mockOnChangeTo} />);
    const toInput = screen.getByLabelText("To Date picker");
    fireEvent.change(toInput, { target: { value: "2023-12-31" } });
    expect(mockOnChangeTo).toHaveBeenCalledWith(new Date("2023-12-31"));
  });

  it("전체 범위 변경 시 onChange 호출", () => {
    render(<DateRangePicker onChange={mockOnChange} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.change(fromInput, { target: { value: "2023-12-01" } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: new Date("2023-12-01") }),
    );
  });

  it("from 입력 지우기 시 null로 설정", () => {
    render(<DateRangePicker from={new Date("2023-12-01")} onChangeFrom={mockOnChangeFrom} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.change(fromInput, { target: { value: "" } });
    expect(mockOnChangeFrom).toHaveBeenCalledWith(null);
  });

  it("to 입력 지우기 시 null로 설정", () => {
    render(<DateRangePicker to={new Date("2023-12-31")} onChangeTo={mockOnChangeTo} />);
    const toInput = screen.getByLabelText("To Date picker");
    fireEvent.change(toInput, { target: { value: "" } });
    expect(mockOnChangeTo).toHaveBeenCalledWith(null);
  });

  it("최소 날짜 제약 준수", () => {
    const minDate = new Date("2023-01-01");
    render(<DateRangePicker min={minDate} onChangeFrom={mockOnChangeFrom} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.change(fromInput, { target: { value: "2022-12-01" } });
    expect(mockOnChangeFrom).not.toHaveBeenCalled();
  });

  it("최대 날짜 제약 준수", () => {
    const maxDate = new Date("2023-12-31");
    render(<DateRangePicker max={maxDate} onChangeTo={mockOnChangeTo} />);
    const toInput = screen.getByLabelText("To Date picker");
    fireEvent.change(toInput, { target: { value: "2024-01-01" } });
    expect(mockOnChangeTo).not.toHaveBeenCalled();
  });

  it("범위 유효성 검증: from이 to보다 늦을 수 없음", () => {
    render(<DateRangePicker to={new Date("2023-12-01")} onChangeFrom={mockOnChangeFrom} />);
    const fromInput = screen.getByLabelText("From Date picker");
    fireEvent.change(fromInput, { target: { value: "2023-12-31" } });
    expect(mockOnChangeFrom).not.toHaveBeenCalled();
  });

  it("범위 유효성 검증: to가 from보다 빠를 수 없음", () => {
    render(<DateRangePicker from={new Date("2023-12-31")} onChangeTo={mockOnChangeTo} />);
    const toInput = screen.getByLabelText("To Date picker");
    fireEvent.change(toInput, { target: { value: "2023-12-01" } });
    expect(mockOnChangeTo).not.toHaveBeenCalled();
  });

  it("from 값 변경 시 입력 필드 업데이트", () => {
    const { rerender } = render(<DateRangePicker from={new Date("2023-12-01")} />);
    expect(screen.getByDisplayValue("2023-12-01")).toBeInTheDocument();

    rerender(<DateRangePicker from={new Date("2023-11-01")} />);
    expect(screen.getByDisplayValue("2023-11-01")).toBeInTheDocument();
  });

  it("to 값 변경 시 입력 필드 업데이트", () => {
    const { rerender } = render(<DateRangePicker to={new Date("2023-12-31")} />);
    expect(screen.getByDisplayValue("2023-12-31")).toBeInTheDocument();

    rerender(<DateRangePicker to={new Date("2024-01-31")} />);
    expect(screen.getByDisplayValue("2024-01-31")).toBeInTheDocument();
  });
});
