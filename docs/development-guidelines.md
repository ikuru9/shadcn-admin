# 개발 가이드라인

## 컴포넌트 개발 표준

> - **함수형 컴포넌트 우선**: 함수형 컴포넌트와 Hooks 사용
> - **TypeScript 타입**: 모든 props에 대해 인터페이스 정의
> - **컴포넌트 네이밍**: snake-case 사용, 파일 이름은 컴포넌트 이름과 일치
> - **단일 책임**: 각 컴포넌트는 하나의 기능만 담당
> - **테스트 우선**: 새로운 기능은 테스트를 먼저 작성/업데이트한 뒤 코드로 green 상태 만들기

```tsx
// 예시: Button 컴포넌트
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  variant,
  size = "medium",
  disabled = false,
  onClick,
  children,
}: React.PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

## 상태 관리 표준

> Zustand를 상태 관리에 사용

```tsx
// store/userStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

## 스타일링 시스템 (Tailwind CSS)

- 모든 스타일링에 Tailwind CSS 유틸리티 클래스를 활용
- 가능하면 하드코딩된 색상이나 일반 `div` 사용을 피할 것
- 모바일 퍼스트로 반응형 프리픽스 사용 (예: `md:w-1/2`)
- 복잡하고 특수한 스타일이 필요한 경우에만 CSS 모듈 사용

## 주의 사항

- 새 라이브러리를 추가하기 전에 기존 의존성(예: Radix UI, Headless UI)으로 구현 가능한지 먼저 확인
- 명시적으로 요청되지 않는 한 `src/assets` 폴더의 파일을 수정하거나 삭제하지 말 것
- 코드 변경 후에는 `pnpm run lint`를 실행해 규칙 준수를 확인할 것
- `node_modules` 또는 `dist` 또는 `src/.generated` 디렉터리는 절대 수정하지 말 것

## 테스트 전략

### 단위 테스트 예시

```tsx
// tests/components/ui/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../src/components/ui/button";

describe("Button Component", () => {
  test("renders button with text", () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Click me
      </Button>,
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
