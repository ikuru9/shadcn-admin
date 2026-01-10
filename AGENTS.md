# AGENTS.md - 에이전트 코딩 가이드

이 저장소는 React(version 19) 애플리케이션입니다. 변경 시 다음 규칙을 따르세요.

## 저장소 구조

```tree
public/                # 정적 에셋
├── favicon.ico
├── robots.txt
src/
├── components/          # 재사용 컴포넌트
│   ├── ui/              # Shadcn UI 컴포넌트
│   └── dialogs/         # 다이얼로그 컴포넌트
├── routes/              # TanStack Router 페이지
├── hooks/               # 커스텀 React 훅
├── store/               # Zustand 스토어
├── features/            # Feature-specific logic and components (could be feature folders)
├── lib/                 # 유틸리티 함수
├── types/               # TypeScript 타입 정의
├── config/              # 애플리케이션 설정
│   └── env.ts           # @t3-oss/env-core 환경 변수
├── constants/           # 애플리케이션 상수
├── context/             # React Context 제공자
├── styles/              # 전역 스타일
tests/                 # 테스트 파일
```

**패키지 명명:** 모든 패키지는 `@example/*` 스코프를 사용합니다.

## 필수 명령어

### 개발 서버

```bash
# Next.js 앱 (포트 3000)
pnpm next-ts dev

# Vite React 앱 (포트 3000)
pnpm vite-react dev
```

### 빌드 및 테스트 명령어

```bash
pnpm run build     # vite build + tsc 실행
pnpm run preview   # 프로덕션 빌드 미리보기
pnpm run test      # Vitest 테스트 실행 (모든 테스트)
```

### 단일 테스트 파일 실행

```bash
# 특정 테스트 파일 실행 (Vite React)
pnpm test tests/components/date-picker.test.tsx
pnpm test tests/components/date-range-picker.test.tsx

# 특정 테스트 파일 워치 모드
pnpm test tests/components/date-picker.test.tsx --watch

# 테스트 패턴으로 필터링
pnpm test --run --reporter=verbose date-picker
```

### 코드 품질 및 포맷팅

```bash
# 전체 저장소 린트 (루트에서 실행)
pnpm lint

# 전체 저장소 포맷팅 (루트에서 실행)
pnpm fmt

# 스테이징된 파일만 린트/포맷 (커밋 전 자동 실행)
pnpm lint:staged
pnpm fmt:staged

# 특정 파일 린트
pnpm -s lint:staged apps/vite-react/src/components/ui/button.tsx
```

## 개발 도구 및 설정

### Linting & Formatting

- **Linter:** oxlint (fast, ESLint-compatible)
- **Formatter:** oxfmt
- **Git Hooks:** lefthook (auto lint/format on commit)
- **TypeScript:** strict mode enabled
- **Node.js:** >=24.12.0 required

### Testing Framework

- **Vite React:** Vitest + @testing-library/react + jsdom
- **Test files:** `*.test.tsx` or `*.spec.tsx`
- **Test location:** `tests/` (mirrors source structure)
- **Test environment:** jsdom for DOM testing
- **Globals:** Vitest globals enabled (`describe`, `it`, `expect`)

### TypeScript Configuration

- **Target:** ES2022 (Vite)
- **JSX:** react-jsx (Vite)
- **Strict:** true (noUnusedLocals, noUnusedParameters, etc.)
- **Path Aliases:**
  - `@/*` → `./src/*`

### 패키지 매니저 제한사항

- **Engines:** pnpm >=10.26.2 required
- **Lockfile:** pnpm-lock.yaml only
- **No npm/yarn:** engines field blocks usage

## 커밋 규칙

Use **conventional commits** (enforced by commitlint):

```bash
# 허용되는 타입들
feat:      # 새로운 기능
fix:       # 버그 수정
refactor:  # 리팩토링 (기능 변경 없음)
docs:      # 문서 변경
style:     # 코드 스타일 변경 (기능 변경 없음)
test:      # 테스트 추가/수정
chore:     # 빌드/의존성 업데이트
perf:      # 성능 개선
ci:        # CI/CD 변경
build:     # 빌드 시스템 변경

# 예시
feat: add user authentication flow
fix: resolve date picker validation bug
refactor: extract common button variants
test: add date picker component tests
```

## 코드 스타일 가이드라인

### Import/Export 패턴

```typescript
// ✅ Good: 그룹화된 imports (절대 경로 사용)
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

// ❌ Bad: 상대 경로 사용
import { cn } from "../../lib/utils";

// ✅ Good: 명확한 export
export { Button, buttonVariants };
export type { ButtonProps };

// ✅ Good: barrel exports (index.ts 파일에서)
export { Button } from "./button";
export { Input } from "./input";
```

### 네이밍 컨벤션

```typescript
// 컴포넌트: PascalCase
function UserProfile() {
  /* ... */
}
const DatePicker = () => {
  /* ... */
};

// 훅: camelCase, 'use' 접두사
function useUserData() {
  /* ... */
}
function useTableUrlState() {
  /* ... */
}

// 타입: PascalCase, 접미사로 구분
type User = {
  /* ... */
};
type UserResponse = {
  /* ... */
};
interface UserStore {
  /* ... */
}

// 상수: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = "/api";

// 함수: camelCase
function formatDate() {
  /* ... */
}
function getPageNumbers() {
  /* ... */
}

// 파일: kebab-case
// user-profile.tsx, date-picker.tsx, use-user-data.ts
```

### TypeScript 패턴

```typescript
// ✅ Good: strict typing, 유틸리티 타입 활용
type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

// ✅ Good: 제네릭 사용
function useTableUrlState<T extends Record<string, unknown>>(params: {
  search: T;
  // ...
}) {
  /* ... */
}

// ✅ Good: discriminated unions
type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; error: string };

// ❌ Bad: any 사용 (테스트 파일 제외)
const data: any = fetchData(); // 금지

// ✅ Good: 타입 가드
function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "id" in obj;
}
```

### React 컴포넌트 패턴

```tsx
// ✅ Good: 함수 컴포넌트 + 훅
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

function UserCard({ user, onEdit }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return <div className="user-card">{/* JSX 내용 */}</div>;
}

// ❌ Bad: forwardRef 사용
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

// ✅ Good: class-variance-authority (CVA) 사용
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { primary: "bg-blue-500", secondary: "bg-gray-500" },
    size: { sm: "px-2 py-1", lg: "px-4 py-2" },
  },
});
```

### 스타일링 패턴

```tsx
// ✅ Good: cn() 유틸리티 사용 (clsx + tailwind-merge)
import { cn } from "@/lib/utils";

function Component({ className }: { className?: string }) {
  return (
    <div className={cn("base-styles", className)}>
      {/* 내용 */}
    </div>
  );
}

// ✅ Good: 조건부 스타일링
<div className={cn(
  "p-4 rounded",
  isActive && "bg-blue-100",
  size === "large" && "text-lg"
)}>

// ✅ Good: Tailwind CSS 우선순위 활용
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
```

### 에러 처리 패턴

```typescript
// ✅ Good: try-catch with proper error types
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch user: ${error.response?.statusText}`);
    }
    throw error;
  }
}

// ✅ Good: React Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// ✅ Good: Zod validation with error handling
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

function validateUser(data: unknown) {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.format());
  }
  return result.data;
}
```

### 테스트 작성 패턴

```typescript
// ✅ Good: 테스트 구조
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("DatePicker", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with default props", () => {
    render(<DatePicker />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange when date is selected", async () => {
    render(<DatePicker onChange={mockOnChange} />);
    // ... test implementation
  });
});

// ✅ Good: 모킹 패턴
vi.mock("dayjs", () => ({
  default: vi.fn((date) => ({
    isValid: () => true,
    toDate: () => new Date(date),
    format: () => "2023-12-25"
  }))
}));
```

## 에이전트를 위한 빠른 시작

### 프로젝트 설정

1. **Navigate to correct app:** `cd apps/next-ts` or `cd apps/vite-react`
2. **Install deps:** `pnpm install` (from root if needed)
3. **Run dev server:** `pnpm dev`
4. **Make changes** following patterns above
5. **Check linting:** `pnpm lint` (runs automatically on commit)
6. **Run tests:** `pnpm test` (Vite React only)

### AI 코딩 도구 통합

**Cursor Rules (권장사항):**

```jsonc
// .cursorrules 또는 .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit",
  },
  "files.associations": {
    "*.css": "tailwindcss",
    "*.scss": "tailwindcss",
  },
  "tailwindCSS.classFunctions": ["cn", "clsx"],
}
```

**Copilot Instructions (권장사항):**

```markdown
# @example/coding-guidelines

이 프로젝트의 코딩 가이드라인:

## 기술 스택

- React 19 + TypeScript (strict mode)
- Vite 7 / Next.js 16
- TanStack Router + TanStack Query
- Tailwind CSS + base/ui + Shadcn/ui
- Vitest + Testing Library

## 필수 규칙

- 절대 경로 imports만 사용 (@/\*)
- cn() 유틸리티로 클래스 결합
- CVA (class-variance-authority)로 컴포넌트 variants
- TypeScript strict mode 준수
- 테스트 파일에만 any 타입 허용
- 커밋 메시지는 conventional commits 형식

## 금지사항

- npm/yarn 사용 (pnpm만 허용)
- 상대 경로 imports
- @ts-ignore, as any 사용
- git hooks 우회
- 직접 스타일 컴포넌트 수정 (frontend-ui-ux-engineer에 위임)
```

## 중요 제한사항

### 절대 금지사항

- **NO `npm` or `yarn`** - use `pnpm` only (enforced by engines)
- **NO `@ts-ignore` or `as any`** in production code (test files 제외)
- **NO bypassing git hooks** - they ensure code quality
- **NO git commits** - Never commit changes without explicit user request
- **NO direct style edits** to visual components - delegate to `frontend-ui-ux-engineer`
- **ALWAYS** use path aliases instead of relative imports (`@/*`, `#/*`)
- **ALWAYS** run `lsp_diagnostics` on changed files before completion

### 에이전트 위임 가이드라인

**frontend-ui-ux-engineer에게 위임해야 할 작업:**

- CSS 클래스 수정, 색상 변경, 간격 조정
- 애니메이션, 트랜지션 추가
- 레이아웃 변경 (flex/grid 조정)
- 반응형 디자인 수정
- 시각적 컴포넌트 스타일링

**직접 처리 가능한 작업:**

- API 호출, 데이터 fetching 로직
- 상태 관리 (Zustand/TanStack Query)
- 이벤트 핸들러, 폼 validation
- TypeScript 타입 정의
- 유틸리티 함수

**특별한 경우 위임:**

- 복잡한 아키텍처 결정 → `oracle` 에이전트
- 외부 라이브러리 문제 해결 → `librarian` 에이전트
- 코드베이스 탐색 → `explore` 에이전트
- 문서 작성 → `document-writer` 에이전트

## 검증 체크리스트

### 코드 변경 전

- [ ] `lsp_diagnostics` 실행하여 타입 에러 확인
- [ ] `pnpm lint` 실행하여 린트 규칙 준수 확인
- [ ] 관련 테스트가 존재하는지 확인

### 코드 변경 후

- [ ] `lsp_diagnostics` shows no errors on changed files
- [ ] `pnpm lint` passes (if applicable)
- [ ] Tests pass (if test changes made)
- [ ] Build succeeds (if build changes made)
- [ ] Following existing import/alias patterns (`@/*`)
- [ ] Components use `cn()` utility for classes
- [ ] TypeScript strict mode 준수
- [ ] Conventional commit message format

### 커밋 전 자동 검증

- lefthook에 의해 자동 실행:
  - oxlint (staged files only)
  - oxfmt (staged files only, then re-stage)
  - commitlint (commit message validation)

이 가이드라인을 따르면 코드베이스의 일관성과 품질을 유지할 수 있습니다.
