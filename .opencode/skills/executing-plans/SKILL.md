---
name: executing-plans
description: 별도 세션에서 검토 지점을 두고 구현 계획을 실행할 때 사용
---

# 계획 실행하기

계획을 읽고 비판적으로 검토한 뒤, 모든 작업을 실행하고 완료 시 보고한다.

## 개요

- 같은 세션에서 작업한다.
- 작업마다 새 서브에이전트를 쓴다.
- 필요하면 배치마다 또는 작업마다 검토한다.

## 요구 사항

- 격리가 필요하면 `using-git-worktrees`를 사용한다.
- 모든 작업이 끝나면 `finishing-a-development-branch`를 사용한다.
