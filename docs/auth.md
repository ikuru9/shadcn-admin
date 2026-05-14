# 인증/권한 처리 정리

## 목적
`src/routes/_authenticated/` 아래 화면은 **권한이 있는 사용자만 접근**하게 한다.

## 전체 흐름
1. 로그인 성공
2. `auth-store.setAccessToken()` 실행
3. `/auth/menus` 1회 조회
4. 로그인 세션 동안 메모리 기준 1시간마다 `/auth/menus` 재조회
5. 각 protected route 진입 시 `/auth/menus/{menuKey}` 권한 확인
6. 권한이 없으면 forbidden 화면으로 이동
7. 로그아웃/reset 시 토큰, 타이머, 캐시 정리

## 관련 파일
- `src/stores/auth-store.ts`
  - access token 저장
  - `/auth/menus` preload
  - 1시간 refresh timer 관리
- `src/routes/_authenticated/-auth-guards.ts`
  - route-level `beforeLoad` guard
  - `/auth/menus/{menuKey}` 권한 확인
- `src/routes/_authenticated/route.tsx`
  - authenticated layout 진입점
- `src/routes/(errors)/$error.tsx`
  - `forbidden` 에러 처리
- `src/gen/hooks/auth/useGetMyMenus.ts`
- `src/gen/hooks/auth/useGetMyMenuPermissions.ts`

## 권한 확인 규칙
- `menuKey` 는 각 route file 에 직접 둔다.
- `beforeLoad` 는 protected route 파일별로 연결한다.
- 같은 route file 안에서 query/search만 바뀌는 경우는 별도 페이지 이동으로 보지 않는다.
- 권한 없음(403)은 `/$error?error=forbidden` 으로 처리된다.

## 새 protected page 추가 방법
1. `src/routes/_authenticated/**` 에 route file 생성
2. 파일 안에 `const menuKey = "..."` 추가
3. `createAuthenticatedBeforeLoad(menuKey)` 를 `beforeLoad` 에 연결
4. backend 의 `/auth/menus/{menuKey}` 와 key 값 일치 확인

## 주의사항
- `src/routes` 아래 helper/test 파일은 파일명 앞에 `-` 를 붙여 router scan 에서 제외한다.
- `auth-store` 의 로그인 성공은 menu preload 실패 때문에 깨지지 않게 유지한다.
- `/auth/menus` 와 `/auth/menus/{menuKey}` 는 generated client 로만 호출한다.

## 개발 체크리스트
- [ ] 로그인 시 `/auth/menus` 가 호출되는가
- [ ] 1시간마다 refresh 되는가
- [ ] protected route 에 `menuKey` 가 있는가
- [ ] 403 시 forbidden 화면으로 가는가
- [ ] 로그아웃 시 타이머/캐시가 정리되는가
