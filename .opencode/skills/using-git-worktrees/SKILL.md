---
name: using-git-worktrees
description: 현재 작업공간과 분리된 기능 작업이 필요할 때 사용
---

# Git worktree 사용하기

계획을 구현하기 전에 안전 검증을 거쳐 격리된 worktree를 만든다.

## 핵심 규칙

체계적인 디렉터리 선택과 안전 검증이 안정적인 격리를 만든다.

## 단계

1. 기존 `.worktrees/` 또는 `worktrees/`가 있는지 확인한다.
2. 해당 디렉터리가 무시되는지 검증한다.
3. 기능 브랜치에 새 worktree를 만든다.
4. 프로젝트 설정과 기준 테스트를 실행한다.
5. worktree 경로와 테스트 상태를 보고한다.
