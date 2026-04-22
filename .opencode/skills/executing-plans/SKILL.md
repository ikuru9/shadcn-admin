---
name: executing-plans
description: Use when executing a written implementation plan with review checkpoints, especially in a separate session.
---

# Executing Plans

## Overview

계획을 비판적으로 읽고, 모든 작업을 실행한 뒤 완료를 보고한다.

## The Process

1. 계획을 읽고 빠진 점이나 우려 사항을 찾는다.
2. 계획이 타당하면 `TodoWrite`를 만들고 실행을 시작한다.
3. 작업을 순서대로 진행하고 각 항목을 적힌 그대로 검증한다.
4. 계획이 요구할 때는 작업마다 새 서브에이전트를 사용한다.
5. 계획이나 위험 수준이 요구하면 검토를 위해 멈춘다.
6. 모든 작업이 끝나면 `finishing-a-development-branch`로 넘긴다.

## When to Stop

- 막히는 지점이 나오면 즉시 멈춘다.
- 계획에 핵심 단계나 검증이 빠져 있으면 멈춘다.
- 추측해야 할 정도로 지시가 불명확하면 멈춘다.

## Integration

- 격리된 작업공간이 필요할 때는 `using-git-worktrees`를 사용한다.
- 의미 있는 검토 지점마다 `requesting-code-review`를 사용한다.
- 모든 작업이 끝나면 `finishing-a-development-branch`를 사용한다.
