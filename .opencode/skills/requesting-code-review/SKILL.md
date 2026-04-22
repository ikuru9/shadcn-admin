---
name: requesting-code-review
description: Use when a task, feature, or branch is ready for review before merge or handoff.
---

# Requesting Code Review

## Overview

문제가 커지기 전에 코드 검토 서브에이전트를 보낸다.

## When to Request Review

- `subagent-driven-development`의 각 작업이 끝날 때
- 큰 기능을 마쳤을 때
- 병합하기 전

## How to Request

1. 관련 git SHA를 구한다.
2. 정확한 작업 또는 계획 맥락과 함께 `code-reviewer`를 보낸다.
3. 다음 단계로 가기 전에 피드백을 반영한다.

## Red Flags

- 변경이 단순해 보여도 검토를 건너뛰지 않는다.
- 치명적인 지적을 무시하지 않는다.
- 중요한 문제를 고치지 않고 진행하지 않는다.

## Integration

- `subagent-driven-development`와 함께 사용한다.
- 검토가 더 필요하면 `finishing-a-development-branch` 전에 사용한다.
