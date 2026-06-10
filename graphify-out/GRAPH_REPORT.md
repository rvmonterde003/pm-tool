# Graph Report - pm-project-mgmt  (2026-06-10)

## Corpus Check
- 119 files · ~35,699 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 604 nodes · 779 edges · 60 communities (51 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `196261ed`
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
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 28 edges
2. `Realign Implementation Plan` - 22 edges
3. `compilerOptions` - 17 edges
4. `createClient()` - 16 edges
5. `rev-3 Review Report — Round 1` - 11 edges
6. `Realign — Design Spec` - 11 edges
7. `How to Run` - 9 edges
8. `Phase Gate Checklist — Realign` - 9 edges
9. `Entry` - 8 edges
10. `WorkStatus` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Field()` --calls--> `cn()`  [EXTRACTED]
  components/procurement/procurement-table.tsx → lib/utils/cn.ts
- `ChangePasswordModal()` --calls--> `cn()`  [EXTRACTED]
  components/app/change-password-modal.tsx → lib/utils/cn.ts
- `ProfileMenu()` --calls--> `cn()`  [EXTRACTED]
  components/app/profile-menu.tsx → lib/utils/cn.ts
- `EntryAttachments()` --calls--> `cn()`  [EXTRACTED]
  components/entries/entry-attachments.tsx → lib/utils/cn.ts
- `ProjectPage()` --calls--> `signEntryAttachments()`  [EXTRACTED]
  app/(app)/projects/[id]/page.tsx → lib/storage/sign-attachments.ts

## Import Cycles
- None detected.

## Communities (60 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (34): updateTodayStatus(), joinViaToken(), sendEmailInvite(), createProcurementItem(), deleteProcurementItem(), updateProcurementItem(), updateProcurementRemarks(), ProfileDock() (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (21): createProject(), deleteProject(), updateCover(), updateProgress(), AppNav(), NAV_ITEMS, NewProjectButton(), Logo() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (33): dependencies, clsx, date-fns, next, react, react-dom, resend, @supabase/ssr (+25 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (31): 1. All 3 reports written, 1. All Phase 1 agents wrote done.md, 1. All Phase 2 agents wrote done.md, 1. All Phase 3 agents wrote done.md, 1. dev-0 wrote done.md, 1. dev-K wrote done.md, 1. dev-L wrote done.md + all prior done.md exist, 2. Build passes (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (15): createEntry(), RealtimeEntries(), RightPanel(), AddEntryModal(), EntriesFeed(), EntryAttachments(), ResolvedAttachment, EntryCard() (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (27): Architecture, `/` — Auth, Background, Colors, `/dashboard` — Main Canvas, Data Model, `entries`, `entry_attachments` (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): File Map, Realign Implementation Plan, Self-Review, Task 10: Server Actions — Members & Invites + Email API Route, Task 11: Project Card Components & New Project Modal, Task 12: Dashboard Page, Task 13: Project Detail — Left Panel, Task 14: Entry Components (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): ChangePasswordModal(), AuthShell(), authButtonClass, authInputClass, RequestSignupForm(), SignInForm(), SignupForm(), createClient()

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (13): Dispatch — Realign, File Naming Convention, How to Run, Layout, Phase 0 (1 tab), Phase 1 (3 tabs in parallel), Phase 2 (4 tabs in parallel), Phase 3 (4 tabs in parallel) (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (13): Code-Smell Red Flags, Defects (FAIL), Error Handling, Findings, Notes (non-blocking), rev-3 Review Report — Round 1, Spec Compliance Checklist, Summary (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.37
Nodes (8): signupInviteEmail(), generateInviteKey(), inviteExpiresAt(), isInviteActive(), normalizeEmail(), POST(), POST(), createAdminClient()

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Part 1 — Task 8: "Server Actions — Projects", Part 2 — Task 13 Step 1: Add `updateCover` to projects.ts, Phase, Plan and Spec (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (8): Commits, Done Signal, File Ownership — HARD CONSTRAINT, Hard Stops, Phase, Plan and Spec, Tests, Your Tasks

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (8): Defects (FAIL), Findings, Notes (non-blocking), rev-[N] Review Report — Round [ROUND_N], Summary, Tests Run, Verdict, What I Did NOT Check

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (8): Defects (FAIL), Findings, Notes (non-blocking), rev-1 Review Report — Round 1, Summary, Tests Run, Verdict, What I Did NOT Check

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): Defects (FAIL), Findings, Notes (non-blocking), rev-2 Review Report — Round 1, Summary, Tests Run, Verdict, What I Did NOT Check

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (6): Plan, Spec, and Scope, Read-Only — HARD CONSTRAINT, Required Report, Tests to Run, What to Check, When You're Done

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (6): Plan, Spec, and Scope, Read-Only — HARD CONSTRAINT, Required Report, Tests to Run, What to Check, When You're Done

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (6): Plan, Spec, and Scope, Read-Only — HARD CONSTRAINT, Required Report, Tests to Run, What to Check, When You're Done

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): Commits, dev-1 complete, Human Actions Required Before Phase 2, Tasks, Tests

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): Commits, dev-B complete, Notes, Tasks, Tests

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (5): Commits, dev-D complete, Notes, Tasks, Tests

### Community 35 - "Community 35"
Cohesion: 0.33
Nodes (5): Commits, dev-G complete, Notes, Tasks, Tests

### Community 36 - "Community 36"
Cohesion: 0.33
Nodes (5): Commits, dev-H complete, Notes, Tasks, Tests

### Community 37 - "Community 37"
Cohesion: 0.33
Nodes (5): Action required, dev-K blocked, Reason, Required done files (per dispatch 13-opus-dev-K.md), Task 16 (not started)

### Community 38 - "Community 38"
Cohesion: 0.40
Nodes (3): geistSans, metadata, orbitron

### Community 39 - "Community 39"
Cohesion: 0.40
Nodes (4): Commits, dev-0 complete, Tasks, Tests

### Community 40 - "Community 40"
Cohesion: 0.40
Nodes (4): Commits, dev-A complete, Tasks, Tests

### Community 41 - "Community 41"
Cohesion: 0.40
Nodes (4): Commits, dev-E complete, Tasks, Tests

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (4): Commits, dev-F complete, Tasks, Tests

### Community 43 - "Community 43"
Cohesion: 0.40
Nodes (4): Commits, dev-I complete, Tasks, Tests

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (4): Commits, dev-J complete, Tasks, Tests

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (4): Action Required, Date, dev-L blocked, Reason

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **364 isolated node(s):** `geistSans`, `orbitron`, `metadata`, `NAV_ITEMS`, `STATUS_OPTIONS` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 8`, `Community 0`, `Community 4`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 0` to `Community 8`, `Community 1`, `Community 4`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `geistSans`, `orbitron`, `metadata` to the rest of the system?**
  _364 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10668563300142248 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._