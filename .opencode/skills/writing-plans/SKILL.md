---
name: writing-plans
description: Use when a task has multiple steps and you need a concrete implementation plan before coding.
---

# Writing Plans

## Overview

다음 엔지니어가 거의 맥락이 없다고 가정하고 계획을 작성한다.

건드릴 파일, 각 작업의 역할, 검증 방법, 실행할 명령을 모두 적는다.

## Plan Header

```markdown
# [Feature Name] Implementation Plan

> **REQUIRED SUB-SKILL:** Implement this plan task by task with `subagent-driven-development` (recommended) or `executing-plans`.

**Goal:** [one sentence]

**Structure:** [2-3 sentences]

**Tech Stack:** [core technologies]

---
```

## Task Rules

- 작업은 2~5분 단위로 나눈다.
- 코드를 바꾸는 단계마다 실제 코드를 보여준다.
- 정확한 파일 경로를 사용한다.
- 정확한 명령과 기대 결과를 적는다.
- 새 작업과 수정 작업에는 대응하는 단위 테스트 경로를 기본으로 포함한다.
- `src/routes/**`는 사용자가 명시적으로 요구한 경우에만 테스트 파일을 넣는다.
- 버그 수정 계획은 재현 테스트부터 시작한다.
- `TBD`, `TODO` 같은 자리표시자를 남기지 않는다.

## Self-Review

인계 전에 커버리지, 자리표시자, 타입 일관성을 점검한다.

## Handoff

계획을 저장한 뒤, 구현 전에 반드시 `plan-review`로 검토하고 정리한다.
