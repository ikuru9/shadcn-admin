# AGENTS.md - Agent Coding Guide

This repository is a React 19 application built with Vite, TanStack Router, Valibot, and Shadcn UI. Follow these rules for all changes.

## Technology Stack
- **React 19** + **TypeScript** (strict mode)
- **Vite 7** for build tooling
- **TanStack Router** for routing
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Valibot** for validation (replaces Zod)
- **Shadcn UI** + **Tailwind CSS** for UI
- **Vitest** + **Testing Library** for testing

## Essential Commands

### Development Server
```bash
pnpm dev    # Start Vite dev server (port 3000)
```

### Build & Test Commands
```bash
pnpm run build     # Vite build + TypeScript check
pnpm run preview   # Preview production build
pnpm run test      # Run all Vitest tests
```

### Running a Single Test File
```bash
# Run specific test file
pnpm test tests/components/date-picker.test.tsx

# Run test in watch mode
pnpm test tests/components/date-picker.test.tsx --watch

# Run tests matching pattern
pnpm test --run --reporter=verbose date-picker

# Run tests with coverage
pnpm run test:coverage
```

### Code Quality & Formatting
```bash
pnpm lint          # Lint entire repo (oxlint)
pnpm fmt           # Format entire repo (oxfmt)
pnpm lint:staged   # Lint/formatted staged files (pre-commit)
pnpm fmt:staged    # Format staged files (pre-commit)
```

## 코드 스타일 가이드라인

### Import/Export 패턴
- 절대 경로 imports만 사용: `@/*`
- 그룹화된 imports
- 명확한 exports
- Barrel exports in index.ts files

### 네이밍 컨벤션
- 컴포넌트: PascalCase
- 훅: camelCase, 'use' 접두사
- 타입: PascalCase
- 상수: UPPER_SNAKE_CASE
- 함수: camelCase
- 파일: kebab-case

### TypeScript 패턴
- Strict typing with utility types
- 제네릭 사용
- Discriminated unions
- 타입 가드
- any 금지 (test files 제외)

### React 컴포넌트 패턴
- 함수 컴포넌트 + 훅
- forwardRef 금지 (React 19)
- CVA (class-variance-authority) for variants

### 스타일링 패턴
- cn() 유틸리티로 클래스 결합
- 조건부 스타일링 with cn()
- Tailwind theme variables

### 에러 처리 패턴
- try-catch with proper error types
- Valibot validation with error handling

### 테스트 작성 패턴
- Vitest + Testing Library
- 모킹 for external libraries

## 에이전트를 위한 빠른 시작

### 프로젝트 설정

1. **Install deps:** `pnpm install`
2. **Run dev server:** `pnpm dev`
3. **Make changes** following patterns above
4. **Check linting:** `pnpm lint`
5. **Run tests:** `pnpm test`

### AI 코딩 도구 통합

**Cursor Rules:**

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

**Copilot Instructions:**

```markdown
# @example/coding-guidelines

이 프로젝트의 코딩 가이드라인:

## 기술 스택

- React 19 + TypeScript (strict mode)
- Vite 7
- TanStack Router + TanStack Query + TanStack Table
- Tailwind CSS + Shadcn/ui
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
- **ALWAYS** use path aliases instead of relative imports (`@/*`)
- **ALWAYS** run `lsp_diagnostics` on changed files before completion

### 에이전트 위임 가이드라인

**frontend-ui-ux-engineer에게 위임:**

- CSS 클래스 수정, 색상 변경, 간격 조정
- 애니메이션, 트랜지션 추가
- 레이아웃 변경 (flex/grid 조정)
- 반응형 디자인 수정
- 시각적 컴포넌트 스타일링

**직접 처리:**

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
