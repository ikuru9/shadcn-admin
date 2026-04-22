---
name: using-git-worktrees
description: Use when you need an isolated workspace for feature work, especially before implementation starts.
---

# Using Git Worktrees

## Overview

디렉터리 선택이 안전한지 확인한 뒤 격리된 worktree를 만든다.

## The Process

1. `.worktrees/` 또는 `worktrees/`가 이미 있는지 확인한다.
2. 해당 디렉터리가 무시되는지 확인한다.
3. 기능 브랜치용 새 worktree를 만든다.
4. 프로젝트 설정과 기준 테스트를 실행한다.
5. worktree 경로와 테스트 상태를 보고한다.

## Safety Checks

- ignore 규칙을 확인하지 않고 worktree 디렉터리가 안전하다고 가정하지 않는다.
- 기준 검증을 건너뛰지 않는다.
- 보고할 때 worktree 경로를 명시한다.

## Reporting

- 생성한 worktree 경로를 공유한다.
- 기준 테스트 결과를 공유한다.
- 계속하기 전에 설정 문제를 기록한다.
