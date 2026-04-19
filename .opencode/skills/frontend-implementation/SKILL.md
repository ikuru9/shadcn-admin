---
name: frontend-implementation
description: React, TanStack Router, shadcn/ui 스타일의 화면 수정과 신규 UI 구현을 다루는 스킬. 레이아웃 변경, 컴포넌트 추가, 폼, 상호작용, 반응형 UI, 테마 관련 작업이 있으면 사용한다.
---

# Frontend Implementation

## 목적
기존 디자인 언어를 유지하면서 화면을 빠르게 바꾼다.

## 작업 방식
- 먼저 주변 컴포넌트와 provider를 읽는다.
- 기존 패턴이 있으면 그대로 따른다.
- 새 추상화는 재사용 가치가 분명할 때만 만든다.

## 체크포인트
- 모바일과 데스크톱에서 모두 동작하는지 확인한다.
- 상태 변경이 렌더링을 깨지 않는지 본다.
- 접근성 속성은 기존 패턴에 맞춰 유지한다.
