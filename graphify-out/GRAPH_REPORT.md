# Graph Report - shadcn-admin  (2026-05-11)

## Corpus Check
- 257 files · ~65,700 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 781 nodes · 604 edges · 255 communities (226 shown, 29 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b00435db`
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 148|Community 148]]
- [[_COMMUNITY_Community 149|Community 149]]
- [[_COMMUNITY_Community 150|Community 150]]
- [[_COMMUNITY_Community 151|Community 151]]
- [[_COMMUNITY_Community 152|Community 152]]
- [[_COMMUNITY_Community 153|Community 153]]
- [[_COMMUNITY_Community 154|Community 154]]
- [[_COMMUNITY_Community 155|Community 155]]
- [[_COMMUNITY_Community 156|Community 156]]

## God Nodes (most connected - your core abstractions)
1. `UI Components Guide` - 13 edges
2. `Docker 배포 가이드` - 12 edges
3. `Repository Workflow` - 11 edges
4. `Design System Inspired by Starbucks` - 10 edges
5. `4. Component Stylings` - 10 edges
6. `useSidebar()` - 9 edges
7. `2. Color Palette & Roles` - 8 edges
8. `cn()` - 6 edges
9. `useDialog()` - 6 edges
10. `API 프록시 설정` - 6 edges

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

## Communities (255 total, 29 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (45): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Do's and Don'ts, 8. Responsive Behavior (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): 전제 조건, 환경 변수, 디렉토리 구조, 포트, 사용법, 서비스 시작, 로그 확인, 서비스 중지 (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (41): Graphify Update Requirement, Generated Code and Validation Constraints, Report Storage Directives, Repository Workflow, Generated Client to Screen Model Flow, API Data Guide, State Boundary Model, @path File Attachment Behavior (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (13): AppTitle(), SidebarMenuCollapsible(), SidebarMenuLink(), cn(), useSidebar(), SidebarGroupAction(), SidebarGroupLabel(), SidebarMenuAction() (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (6): DataTableRowActions(), NavUser(), useStore(), useDialog(), useSignOut(), UsersPrimaryButtons()

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (8): PetsEdit(), PetsCreate(), useSubmissionToast(), UsersActionDialog(), DataTableRowActions(), flattenIssues(), parseIssues(), zodMiniResolver()

### Community 6 - "Community 6"
Cohesion: 0.2
Nodes (10): getCustomFilterOptions(), resolveColumnId(), resolveSchemaField(), resolveSchemaFieldType(), resolveSchemaShape(), useDataTableConfigs(), getNextState(), identity() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (14): Use matching Base UI primitives, UI Components Guide, Keep useRender, mergeProps, and cn close to the component, Low-level, accessible, composable components, No business logic, fetching, or domain state, No hardcoded colors or compatibility hacks, Do not introduce Radix or other primitive libraries into Base UI wrappers, Do not reimplement keyboard, focus, dismissal, or ARIA behavior (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (11): 빌드/린트/테스트 명령어, 개발 및 빌드, 테스트 실행, 프로젝트 구조, 기술 스택, code:bash (pip install graphifyy && graphify install), code:bash (# 개발 서버 실행), code:bash (# 전체 테스트 실행 (Vitest)) (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (4): ConfigDrawer(), useDirection(), useLayout(), useTheme()

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (4): Pets(), Users(), useSearch(), Search()

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (6): addTag(), handleSubmit(), normalizeTag(), removeTag(), sleep(), onSubmit()

### Community 13 - "Community 13"
Cohesion: 0.31
Nodes (5): clearQueryClientCache(), getQueryClient(), registerQueryClient(), getContext(), Provider()

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (4): client(), refreshAccessToken(), getCookie(), setCookie()

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (8): code:nginx (server {), code:nginx (location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|tt), code:nginx (location /sw.js {), HTTPS 자동 리다이렉트, Nginx 설정, Security Headers, Service Worker 및 Web Manifest, Static Assets 캐싱

### Community 20 - "Community 20"
Cohesion: 0.6
Nodes (5): cn(), FormControl(), FormDescription(), FormMessage(), useFormField()

### Community 21 - "Community 21"
Cohesion: 0.53
Nodes (4): createMockCell(), createMockColumn(), createMockRow(), createMockTable()

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (4): adapter(), createError(), createResponse(), waitForTick()

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (6): Keep side effects explicit, src/lib AGENTS, Do not put feature, route, or page-specific logic here, Reuse existing helpers before adding new ones, Shared helpers, client utilities, and cross-cutting support code only, Guard window and document access for SSR

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (6): Framework and Tooling Stack, Development and Test Commands, Graphify Setup and Citation, Shadcn Admin Dashboard Overview, Project Structure Tree, Technology Stack

### Community 25 - "Community 25"
Cohesion: 0.6
Nodes (3): configResolved(), generateBundle(), writeBundle()

### Community 28 - "Community 28"
Cohesion: 0.6
Nodes (3): handleFromInputChange(), handleToInputChange(), parseInputDate()

### Community 29 - "Community 29"
Cohesion: 0.6
Nodes (4): getCellProps(), getRowProps(), wrapCellHandler(), wrapRowHandler()

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (3): AGENTS, graphify, Guides

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (4): Light PNG Favicon Variant, Light SVG Favicon Variant, PNG Favicon Variant, SVG Favicon Variant

## Knowledge Gaps
- **104 isolated node(s):** `code:bash (pip install graphifyy && graphify install)`, `code:bash (# 개발 서버 실행)`, `code:bash (# 전체 테스트 실행 (Vitest))`, `code:tree (public/                  # 정적 에셋)`, `기술 스택` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useSidebar()` connect `Community 3` to `Community 9`, `Community 4`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `useDialog()` connect `Community 4` to `Community 5`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `NavUser()` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `code:bash (pip install graphifyy && graphify install)`, `code:bash (# 개발 서버 실행)`, `code:bash (# 전체 테스트 실행 (Vitest))` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._