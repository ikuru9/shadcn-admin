import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { PasswordInput } from "@/components/custom-input/password-input";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="toggle-button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">👁️</div>,
  EyeOff: () => <div data-testid="eye-off-icon">🙈</div>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

describe("PasswordInput", () => {
  it("초기에 비밀번호 타입의 입력 필드를 렌더링합니다", () => {
    render(<PasswordInput />);
    const input = screen.getByDisplayValue("");

    expect(input).toHaveAttribute("type", "password");
  });

  it("버튼을 클릭하면 텍스트 타입으로 전환합니다", () => {
    render(<PasswordInput />);
    const button = screen.getByTestId("toggle-button");
    const input = screen.getByDisplayValue("");

    fireEvent.click(button);

    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("버튼을 다시 클릭하면 비밀번호 타입으로 전환합니다", () => {
    render(<PasswordInput />);
    const button = screen.getByTestId("toggle-button");
    const input = screen.getByDisplayValue("");

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();
  });

  it("disabled 속성이 true일 때 버튼을 비활성화합니다", () => {
    render(<PasswordInput disabled={true} />);
    const button = screen.getByTestId("toggle-button");

    expect(button).toBeDisabled();
  });

  it("래퍼 div에 className을 적용합니다", () => {
    render(<PasswordInput className="custom-class" />);
    const wrapper = screen.getByTestId("toggle-button").parentElement;

    expect(wrapper).toHaveClass("custom-class");
  });

  it("입력 요소에 ref를 전달합니다", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("다른 속성들을 입력 요소에 전달합니다", () => {
    render(<PasswordInput placeholder="Enter password" value="test" onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Enter password");

    expect(input).toHaveValue("test");
  });
});
