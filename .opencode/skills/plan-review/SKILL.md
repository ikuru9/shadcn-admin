---
name: plan-review
description: Use when reviewing a written implementation plan before coding starts, especially for gaps, ambiguity, or scope issues.
---

# Plan Review

## Overview

`writing-plans`로 작성된 계획을 검토해 구현 가능한 상태로 만든다.

## Review Checklist

1. 요구사항이 모두 반영됐는지 확인한다.
2. 각 작업이 2~5분 안에 끝날 정도로 작은지 확인한다.
3. 모든 작업에 정확한 파일 경로가 있는지 확인한다.
4. 테스트 파일이나 테스트 전략이 포함됐는지 확인한다.
5. 검증 명령이 포함됐는지 확인한다.
6. 생성 코드 직접 수정, 경로 변경, API 계약 변경이 있는지 확인한다.
7. 흐름이 `RED -> GREEN -> REFACTOR`를 따르는지 확인한다.

## Cleanup Rules

- 모호한 표현을 제거한다.
- 빠진 검증 단계를 채운다.
- 선행 작업은 앞쪽으로 옮긴다.
- 범위를 벗어난 내용은 제거하거나 분리한다.
- `TBD`, `TODO` 같은 자리표시자를 남기지 않는다.

## Handoff

- 계획이 준비됐으면 `test-driven-development`로 넘긴다.
- 계획을 고쳐야 하면 수정한 뒤 다시 검토한다.
- 검토가 끝났으면 결과를 `docs/report/plans/YYYY-MM-DD-<feature-name>.md`에 저장한다.
