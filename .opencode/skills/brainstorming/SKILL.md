---
name: brainstorming
description: Use when exploring an idea before implementation, especially when requirements, scope, or design choices are still unclear.
---

# Brainstorming Ideas Into Designs

## Overview

아이디어를 구조화된 대화로 구체적인 설계와 명세로 바꾼다.

먼저 현재 프로젝트 맥락을 이해하고, 한 번에 하나씩 질문하면서 범위를 좁힌다. 목표가 분명해지면 설계를 제시하고 승인을 기다린다.

<HARD-GATE>
Do not invoke any implementation skill, write code, or scaffold anything before the design is presented and approved.
</HARD-GATE>

## Checklist

1. 파일, 문서, 최근 커밋을 확인해 프로젝트 맥락을 탐색한다.
2. 확인 질문은 한 번에 하나씩만 한다.
3. 장단점과 추천안을 포함해 2~3개 접근 방식을 제안한다.
4. 설계를 섹션별로 제시하고 승인을 받는다.
5. 명세를 `docs/report/specs/YYYY-MM-DD-<topic>-design.md`에 작성한다.
6. 자리표시자, 모순, 모호성, 범위 초과를 점검한다.
7. 작성한 명세를 사용자가 검토하도록 요청한다.
8. `writing-plans`를 호출해 구현 계획 단계로 넘어간다.

## Key Principles

- 질문은 한 번에 하나씩만 한다.
- 가능하면 객관식 질문을 우선한다.
- YAGNI를 엄격히 지킨다.
- 결정 전에 대안을 탐색한다.
- 설계 승인 전에는 구현을 시작하지 않는다.
