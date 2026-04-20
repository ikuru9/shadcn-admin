# 코드 품질 검토자 프롬프트 템플릿

코드 품질 검토자 서브에이전트를 보낼 때 이 템플릿을 사용한다.

**목적:** 구현이 잘 구성되었는지 검증한다.

```
Task tool (general-purpose):
  `requesting-code-review/code-reviewer.md` 템플릿을 사용한다.

  WHAT_WAS_IMPLEMENTED: [구현자 보고서에서 가져온 내용]
  PLAN_OR_REQUIREMENTS: [계획 파일]의 Task N
  BASE_SHA: [작업 전 커밋]
  HEAD_SHA: [현재 커밋]
  DESCRIPTION: [작업 요약]

  검토할 점:
  - `src/routes/**` 테스트 예외가 정책과 맞는가
  - MSW가 로컬 전용 기준을 넘지 않았는가
  - 대응하는 단위 테스트 파일이 필요한 변경에는 포함됐는가
```
