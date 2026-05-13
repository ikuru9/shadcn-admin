# Graph Report - shadcn-admin  (2026-05-13)

## Corpus Check
- 256 files · ~65,805 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 830 nodes · 740 edges · 228 communities (202 shown, 26 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c034c1fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 133|Community 133]]
- [[_COMMUNITY_Community 134|Community 134]]
- [[_COMMUNITY_Community 135|Community 135]]
- [[_COMMUNITY_Community 136|Community 136]]
- [[_COMMUNITY_Community 137|Community 137]]
- [[_COMMUNITY_Community 138|Community 138]]
- [[_COMMUNITY_Community 139|Community 139]]
- [[_COMMUNITY_Community 140|Community 140]]

## God Nodes (most connected - your core abstractions)
1. `UI Components Guide` - 13 edges
2. `Docker 배포 가이드` - 12 edges
3. `Repository Workflow` - 11 edges
4. `zodMiniResolver()` - 10 edges
5. `Design System Inspired by Starbucks` - 10 edges
6. `4. Component Stylings` - 10 edges
7. `useSidebar()` - 9 edges
8. `2. Color Palette & Roles` - 8 edges
9. `useDialog()` - 7 edges
10. `cn()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Repository Workflow` --semantically_similar_to--> `Document, Plan, Implement, Review Order`  [INFERRED] [semantically similar]
  AGENTS.md → docs/agent-guides/workflow-guide.md
- `Technology Stack` --semantically_similar_to--> `Framework and Tooling Stack`  [INFERRED] [semantically similar]
  README.md → docs/agent-guides/project-guide.md
- `Repository Workflow` --references--> `Workflow Guide`  [EXTRACTED]
  AGENTS.md → docs/agent-guides/workflow-guide.md
- `Generated Code and Validation Constraints` --conceptually_related_to--> `src/gen Derived Artifact`  [INFERRED]
  AGENTS.md → docs/agent-guides/hotspots-guide.md
- `Graphify Update Requirement` --references--> `Project Guide`  [EXTRACTED]
  AGENTS.md → docs/agent-guides/project-guide.md

## Hyperedges (group relationships)
- **Workflow Documentation Chain** — agents_root_workflow, workflow_guide, planning_review_guide [INFERRED 0.86]
- **Report and Plan Storage Policy** — agents_root_report_storage, planning_storage, report_readme [INFERRED 0.88]
- **Theme-Aware Favicon Set** — index_favicon_setup, favicon_svg, favicon_light_svg, favicon_png, favicon_light_png [EXTRACTED 0.96]

## Communities (228 total, 26 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (47): Graphify Update Requirement, Generated Code and Validation Constraints, Report Storage Directives, Repository Workflow, Generated Client to Screen Model Flow, API Data Guide, State Boundary Model, @path File Attachment Behavior (+39 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (45): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Do's and Don'ts, 8. Responsive Behavior (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (39): 전제 조건, 환경 변수, 디렉토리 구조, 포트, 헬스 체크, 환경별 배포, 개요, 문제 해결 (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (15): Badge(), accountFormSchema, AccountFormValues, defaultValues, languages, languageValues, NewChatProps, User (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (18): AppearanceForm(), appearanceFormSchema, AppearanceFormValues, defaultValues, DisplayForm(), displayFormSchema, DisplayFormValues, items (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (16): AppTitle(), ConfigDrawer(), useDirection(), useLayout(), SidebarMenuCollapsible(), SidebarMenuLink(), cn(), useSidebar() (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (16): PetsEdit(), PetsCreate(), addTag(), handleSubmit(), normalizeTag(), removeTag(), route, route (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (7): DataTableRowActions(), DataTableRowActions(), NavUser(), useStore(), useDialog(), useSignOut(), UsersPrimaryButtons()

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (10): getCustomFilterOptions(), resolveColumnId(), resolveSchemaField(), resolveSchemaFieldType(), resolveSchemaShape(), useDataTableConfigs(), getNextState(), identity() (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (14): Use matching Base UI primitives, UI Components Guide, Keep useRender, mergeProps, and cn close to the component, Low-level, accessible, composable components, No business logic, fetching, or domain state, No hardcoded colors or compatibility hacks, Do not introduce Radix or other primitive libraries into Base UI wrappers, Do not reimplement keyboard, focus, dismissal, or ARIA behavior (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.21
Nodes (6): cn(), formSchema, UserActionDialogProps, UserForm, UsersActionDialog(), DataTableRowActionsProps

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (11): 빌드/린트/테스트 명령어, 개발 및 빌드, 테스트 실행, 프로젝트 구조, 기술 스택, code:bash (pip install graphifyy && graphify install), code:bash (# 개발 서버 실행), code:bash (# 전체 테스트 실행 (Vitest)) (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (4): Pets(), Users(), useSearch(), Search()

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (11): 사용법, 서비스 시작, 로그 확인, 서비스 중지, 컨테이너 재시작, 컨테이너 삭제, code:bash (# 개발 환경), code:bash (# 전체 로그) (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (4): defaultValues, ProfileForm(), profileFormSchema, ProfileFormValues

### Community 16 - "Community 16"
Cohesion: 0.31
Nodes (5): clearQueryClientCache(), getQueryClient(), registerQueryClient(), getContext(), Provider()

### Community 18 - "Community 18"
Cohesion: 0.36
Nodes (4): client(), refreshAccessToken(), getCookie(), setCookie()

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): AccountForm(), OtpForm(), UsersInviteDialog(), useSubmissionToast(), UsersActionDialog(), DataTableRowActions(), zodMiniResolver()

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (3): formSchema, UserInviteDialogProps, UserInviteForm

### Community 21 - "Community 21"
Cohesion: 0.53
Nodes (4): createMockCell(), createMockColumn(), createMockRow(), createMockTable()

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (4): adapter(), createError(), createResponse(), waitForTick()

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (6): Keep side effects explicit, src/lib AGENTS, Do not put feature, route, or page-specific logic here, Reuse existing helpers before adding new ones, Shared helpers, client utilities, and cross-cutting support code only, Guard window and document access for SSR

### Community 27 - "Community 27"
Cohesion: 0.6
Nodes (3): configResolved(), generateBundle(), writeBundle()

### Community 30 - "Community 30"
Cohesion: 0.6
Nodes (3): handleFromInputChange(), handleToInputChange(), parseInputDate()

### Community 31 - "Community 31"
Cohesion: 0.6
Nodes (4): getCellProps(), getRowProps(), wrapCellHandler(), wrapRowHandler()

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (3): AGENTS, graphify, Guides

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (4): Light PNG Favicon Variant, Light SVG Favicon Variant, PNG Favicon Variant, SVG Favicon Variant

## Knowledge Gaps
- **138 isolated node(s):** `{ clearMock }`, `{ ensureQueryDataMock }`, `{ setQueryDataMock }`, `OfflineErrorProps`, `Route` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useSidebar()` connect `Community 5` to `Community 7`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ConfigDrawer()` connect `Community 5` to `Community 4`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `Community 4` to `Community 5`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `{ clearMock }`, `{ ensureQueryDataMock }`, `{ setQueryDataMock }` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._