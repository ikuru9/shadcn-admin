---
name: subagent-driven-development
description: 현재 세션에서 독립 작업으로 계획을 실행할 때 사용
---

# 서브에이전트 기반 개발

작업마다 새 서브에이전트를 보내 계획을 실행하고, 각 작업 뒤에는 사양 적합성 검토와 코드 품질 검토를 순서대로 수행한다.

## 핵심 원칙

작업마다 새 서브에이전트 + 2단계 검토 = 높은 품질과 빠른 반복.

## 절차

1. 계획을 읽고 모든 작업을 추출한다.
2. 작업 목록을 만든다.
3. 한 작업에 대해 구현 서브에이전트를 보낸다.
4. 서브에이전트가 질문하면 작업을 계속하기 전에 답한다.
5. 구현 후 사양 적합성 검토자를 보낸다.
6. 적합하면 코드 품질 검토자를 보낸다.
7. 문제가 있으면 수정하고 승인될 때까지 다시 검토한다.
8. 작업을 완료로 표시하고 다음 작업으로 넘어간다.
9. 모든 작업이 끝나면 `requesting-code-review`를 거쳐 `finishing-a-development-branch`로 마무리한다.

## 연계

- 계획 작성에는 `writing-plans`를 사용하고, 구현 전에는 `plan-review`를 거친다.
- 구현 작업 안에서는 `test-driven-development`를 사용한다.
- 검토 템플릿에는 `requesting-code-review`를 사용한다.
- 격리가 필요하면 `using-git-worktrees`를 사용한다.
- 마무리에는 `finishing-a-development-branch`를 사용한다.
