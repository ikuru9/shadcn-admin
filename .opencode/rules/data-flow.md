# 데이터 흐름 규칙

- 상태는 필요할 때만 분리한다.
- TanStack Query는 서버 상태, context와 Zustand는 앱 상태, form은 입력 상태로 본다.
- generated client 결과를 화면 모델로 바꾸는 위치를 명확히 둔다.
- TanStack Query, context provider, form 상태, generated client 소비부의 경계를 분명히 한다.
- API 응답과 화면 상태가 엇갈리면 먼저 흐름을 정리한다.
- optimistic update, loading, empty, error 상태를 함께 검토한다.
- 데이터 흐름을 바꿀 때는 소비부 단위 테스트를 우선 계획한다.
- 서버 상태와 UI 상태가 섞인 경우에는 먼저 경계를 분리한다.
