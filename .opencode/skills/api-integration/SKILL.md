---
name: api-integration
description: 생성된 API 클라이언트, zod 스키마, React Query, 폼 검증, 상태 연결을 다루는 스킬. 엔드포인트 연결, 응답 shape 확인, mutation/query 추가, 타입 불일치 수정 요청이 있으면 사용한다.
---

# API Integration

## 목적
생성된 타입과 클라이언트를 안전하게 화면에 연결한다.

## 작업 방식
- 먼저 generated 코드와 사용처를 함께 읽는다.
- 응답과 폼 입력의 shape을 맞춘다.
- 변환이 필요하면 경계에서만 처리한다.

## 체크포인트
- 타입 오류가 숨은 런타임 오류를 가리지는 않는지 본다.
- 쿼리 키와 mutation 후 갱신 흐름이 일치하는지 확인한다.
