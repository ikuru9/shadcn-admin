---
name: subagent-driven-development
description: Use when executing a plan as independent tasks in the current session, especially when subagents and review checkpoints are needed.
---

# Subagent-Driven Development

## Overview

작업마다 새 서브에이전트를 사용하고, 결과는 두 단계로 검토한다.

## The Process

1. 계획을 읽고 작업을 추출한다.
2. 작업 목록을 만든다.
3. 한 작업에 대해 서브에이전트를 보낸다.
4. 계속하기 전에 확인 질문에 답한다.
5. 결과를 사양 적합성 기준으로 검토한다.
6. 결과를 코드 품질 기준으로 검토한다.
7. 승인될 때까지 문제를 수정한다.
8. 작업을 완료로 표시하고 다음 작업으로 간다.
9. 모든 작업이 끝나면 `requesting-code-review`, 그다음 `finishing-a-development-branch`로 넘긴다.

## Review Gates

- 사양 적합성이 승인되기 전에는 다음으로 넘어가지 않는다.
- 코드 품질이 승인되기 전에는 다음으로 넘어가지 않는다.
- 현재 작업의 문제를 다음 작업 전에 고친다.

## Integration

- 계획 작성에는 `writing-plans`를 사용한다.
- 구현 전에는 `plan-review`를 사용한다.
- 각 작업 안에서는 `test-driven-development`를 사용한다.
- 격리가 필요하면 `using-git-worktrees`를 사용한다.
