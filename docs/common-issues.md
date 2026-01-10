# 자주 발생하는 문제

## 이슈 1: Vite 개발 서버 시작이 느림

**해결 방법**:

- 의존성 사전 빌드 캐시 확인
- `pnpm run dev --force`로 강제 재빌드
- `vite.config.ts`의 optimizeDeps 설정 최적화

## 이슈 2: TypeScript 타입 오류

**해결 방법**:

- 올바른 타입 정의 패키지가 설치되어 있는지 확인
- `tsconfig.json` 설정 확인
- `pnpm run type-check`로 타입 검사
