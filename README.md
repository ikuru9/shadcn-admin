# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

## 빌드/린트/테스트 명령어

### 개발 및 빌드

```bash
# 개발 서버 실행
pnpm run dev

# 프로덕션 미리보기
pnpm run preview

# 전체 프로젝트 린팅 (oxlint)
pnpm run lint

# 전체 프로젝트 포맷팅 (oxfmt)
pnpm run fmt

# 스테이징된 파일만 린팅 (pre-commit hook)
pnpm run lint:staged

# 스테이징된 파일만 포맷팅 (pre-commit hook)
pnpm run fmt:staged

# 커밋 (Conventional Commits)
pnpm run commit
```

### 테스트 실행

```bash
# 전체 테스트 실행 (Vitest)
pnpm run test

# 단일 테스트 파일 실행
pnpm run test run src/components/ui/button.test.tsx

# 특정 패턴의 테스트 실행
pnpm run test run --pattern="button"

# 워치 모드
pnpm run test:watch

# 커버리지 리포트 생성
pnpm run test:coverage
```

## 프로젝트 구조

```tree
public/                  # 정적 에셋
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
└── styles/              # 전역 스타일
tests/                   # 테스트 파일
```

## 기술 스택

- **언어:** TypeScript (strict mode)
- **프론트엔드 프레임워크**: React 19
- **빌드 도구**: Vite
- **상태 관리**: TanStack Query + Zustand
- **라우팅**: TanStack Router (파일 기반 라우트)
- **UI 컴포넌트**: Shadcn UI + Radix UI
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **테스트 프레임워크**: Vitest + React Testing Library + MSW
- **코드 품질**: oxlint + oxfmt
- **아이콘**: Lucide React
- **패키지 관리자**: pnpm (필수)
