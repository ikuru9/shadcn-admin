# Hotspots Guide

When: Read when changes may touch high-coupling or globally sensitive areas.

- `useSidebar`, `showSubmittedData`, `cn` 같은 고연결 지점이 있다.
- `ThemeProvider`, `FontProvider`, `DirectionProvider` 순서는 전역 동작에 영향을 준다.
- `src/gen/`는 파생 산출물로 다뤄야 한다.
- `pnpm typecheck`가 기본 관문이다.
