---
name: finishing-a-development-branch
description: Use when implementation is complete and you need to decide how to integrate the branch.
---

# Finishing a Development Branch

## Overview

작업을 확인하고, 통합 옵션을 제시한 뒤, 선택한 경로를 실행하고 정리한다.

## The Process

1. 관련 테스트 모음이 통과하는지 확인한다.
2. 기준 브랜치를 정한다.
3. 병합, PR, 유지, 폐기 옵션을 제시한다.
4. 선택한 옵션을 실행한다.
5. 필요하면 worktree를 정리한다.

## Decision Options

- 브랜치가 준비됐고 로컬 통합이 적절하면 병합한다.
- 검토나 원격 통합이 필요하면 PR을 연다.
- 추가 작업이 예상되면 브랜치를 유지한다.
- 더 이상 필요하지 않을 때만 폐기한다.

## Integration

- 검토가 아직 필요하면 병합 전에 `requesting-code-review`를 사용한다.
- 작업이 격리되어 있었으면 `using-git-worktrees` 정리 단계를 사용한다.
