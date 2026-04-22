---
name: test-driven-development
description: Use when implementing a feature or bug fix and you need to write tests before production code.
---

# Test-Driven Development

## Overview

테스트를 먼저 작성하고, 실패를 확인한 뒤, 통과하는 가장 작은 변경을 만든다.

**Never write production code before a failing test exists.**

## The Cycle

1. RED - 하나의 동작에 대한 최소 테스트를 작성한다.
2. 예상한 이유로 실패하는지 확인한다.
3. GREEN - 통과할 최소 구현을 작성한다.
4. 통과하는지 확인한다.
5. REFACTOR - 테스트가 초록 상태를 유지되게 정리한다.

## File Rules

- 새 작업에는 보통 대응하는 단위 테스트 파일을 함께 둔다.
- `src/routes/**`는 사용자가 명시적으로 요구한 경우에만 테스트 파일을 둔다.
- 버그 수정은 먼저 재현 테스트가 있어야 한다.

## Red Flags

- 실패하는 테스트보다 프로덕션 코드를 먼저 작성하는 것.
- 테스트가 초록이 되기 전에 리팩터링하는 것.
- 수동 검증으로 테스트 우선 규칙을 대신하려는 것.

## Handoff

이 작업을 `subagent-driven-development`로 실행할지 `executing-plans`로 실행할지 묻는다.
