# Graph Report - docs  (2026-04-18)

## Corpus Check
- Corpus is ~1,041 words - fits in a single context window. You may not need a graph.

## Summary
- 25 nodes · 35 edges · 4 communities detected
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Absolute Alias Imports  Essential Commands|Absolute Alias Imports / Essential Commands]]
- [[_COMMUNITY_Core Frontend Stack  React 19 Component Rules|Core Frontend Stack / React 19 Component Rules]]
- [[_COMMUNITY_Coding Guidelines  Error Handling Patterns|Coding Guidelines / Error Handling Patterns]]
- [[_COMMUNITY_Delegation Guidelines  Important Restrictions|Delegation Guidelines / Important Restrictions]]

## God Nodes (most connected - your core abstractions)
1. `Coding Guidelines` - 8 edges
2. `Prohibitions` - 5 edges
3. `Core Frontend Stack` - 5 edges
4. `PNPM-Only Workflow` - 4 edges
5. `Strict TypeScript` - 4 edges
6. `Tailwind and data-slot Styling` - 4 edges
7. `Important Restrictions` - 3 edges
8. `Selective Guide Reading` - 3 edges
9. `Absolute Alias Imports` - 3 edges
10. `React 19 Component Rules` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Coding Guidelines` --references--> `Import/Export Rules`  [EXTRACTED]
  docs/agent-guides/coding-guidelines.md → docs/agent-guides/coding/import-export.md
- `Coding Guidelines` --references--> `TypeScript Patterns`  [EXTRACTED]
  docs/agent-guides/coding-guidelines.md → docs/agent-guides/coding/typescript-patterns.md
- `Coding Guidelines` --references--> `React Component Patterns`  [EXTRACTED]
  docs/agent-guides/coding-guidelines.md → docs/agent-guides/coding/react-patterns.md
- `Coding Guidelines` --references--> `Styling Patterns`  [EXTRACTED]
  docs/agent-guides/coding-guidelines.md → docs/agent-guides/coding/styling-patterns.md
- `Core Frontend Stack` --conceptually_related_to--> `Strict TypeScript`  [INFERRED]
  docs/agent-guides/technology-stack.md → docs/agent-guides/coding/typescript-patterns.md

## Hyperedges (group relationships)
- **Coding Detail Guides** — import_export_rules, naming_conventions, typescript_patterns, react_component_patterns, styling_patterns, error_handling_patterns, test_writing_patterns [EXTRACTED 1.00]
- **Workflow Restriction Mesh** — quick_start_guide, important_restrictions_guide, prohibitions_guide, delegation_guidelines_guide [INFERRED 0.84]

## Communities

### Community 0 - "Absolute Alias Imports / Essential Commands"
Cohesion: 0.32
Nodes (8): Absolute Alias Imports, Essential Commands, Git Workflow Restrictions, Import/Export Rules, PNPM-Only Workflow, Prohibitions, Strict TypeScript, TypeScript Patterns

### Community 1 - "Core Frontend Stack / React 19 Component Rules"
Cohesion: 0.4
Nodes (6): Core Frontend Stack, React 19 Component Rules, React Component Patterns, Styling Patterns, Tailwind and data-slot Styling, Technology Stack

### Community 2 - "Coding Guidelines / Error Handling Patterns"
Cohesion: 0.4
Nodes (6): Coding Guidelines, Validation and Error Boundary Strategy, Error Handling Patterns, Naming Conventions, Test Writing Patterns, Vitest Testing Stack

### Community 3 - "Delegation Guidelines / Important Restrictions"
Cohesion: 0.4
Nodes (5): Delegation Guidelines, Important Restrictions, Quick Start, Selective Guide Reading, Visual Change Delegation

## Knowledge Gaps
- **3 isolated node(s):** `Technology Stack`, `Essential Commands`, `Naming Conventions`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Coding Guidelines` connect `Coding Guidelines / Error Handling Patterns` to `Absolute Alias Imports / Essential Commands`, `Core Frontend Stack / React 19 Component Rules`, `Delegation Guidelines / Important Restrictions`?**
  _High betweenness centrality (0.397) - this node is a cross-community bridge._
- **Why does `Core Frontend Stack` connect `Core Frontend Stack / React 19 Component Rules` to `Absolute Alias Imports / Essential Commands`, `Coding Guidelines / Error Handling Patterns`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `Prohibitions` connect `Absolute Alias Imports / Essential Commands` to `Delegation Guidelines / Important Restrictions`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Core Frontend Stack` (e.g. with `Strict TypeScript` and `React 19 Component Rules`) actually correct?**
  _`Core Frontend Stack` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Strict TypeScript` (e.g. with `Core Frontend Stack` and `Absolute Alias Imports`) actually correct?**
  _`Strict TypeScript` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Technology Stack`, `Essential Commands`, `Naming Conventions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._