**Recommended model for this tab:** `opus` — set with `/model opus` before continuing.

You are **rev-3** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file, the spec file, and the source files listed below.

## Read-Only — HARD CONSTRAINT

- You may **read** any file.
- You may **run tests** to confirm what you observe.
- You may **not** edit, create, or delete source files.
- You may **not** commit.
- The only file you create is your report at the path specified below.

## Plan, Spec, and Scope

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`
- Tasks under your review: Tasks 7, 11, 12, 13, 14, 15, 16, 18
- Files you must inspect:
  - `components/ui/honeycomb-bg.tsx`
  - `components/ui/toast.tsx`
  - `app/(app)/layout.tsx`
  - `components/projects/project-card.tsx`
  - `components/projects/new-project-card.tsx`
  - `components/projects/new-project-modal.tsx`
  - `components/projects/project-grid.tsx`
  - `app/(app)/dashboard/page.tsx`
  - `components/detail/cover-upload.tsx`
  - `components/detail/left-panel.tsx`
  - `components/entries/entry-card.tsx`
  - `components/entries/add-entry-modal.tsx`
  - `components/entries/entries-feed.tsx`
  - `components/detail/right-panel.tsx`
  - `app/(app)/projects/[id]/page.tsx`
  - `components/detail/realtime-entries.tsx`

## What to Check

1. **Spec compliance — Visual Design System:**
   - Does `project-card.tsx` apply `bg-black/60` overlay and remove it when `progress === 100`?
   - Does progress `=== 100` add a neon orange ring (`ring-1 ring-orange shadow-orange`) per spec?
   - Does `project-card.tsx` use `aspect-[4/3]` and `rounded-2xl`?
   - Does `honeycomb-bg.tsx` use the correct hex colors (`#1a1a1a` bg, `#222222` hex cells)?
   - Does `left-panel.tsx` progress input style match spec (neon orange, `font-bold`)?
   - Does `entry-card.tsx` render three bento cells with `border-border` separation?
   - Do cards use surface color `#1e1e1e`, panel `#252525`, border `#2e2e2e`?

2. **Spec compliance — Functional:**
   - Does `entries-feed.tsx` paginate by month (prev/next month controls)?
   - Does `entries-feed.tsx` disable "Add entry" when current week already has 2 entries?
   - Does `add-entry-modal.tsx` show a "max reached" message (not just disable the button) when `weeklyCount >= 2`?
   - Does `new-project-modal.tsx` correctly call `createProject` and close on success?
   - Does `realtime-entries.tsx` subscribe to `entries` table filtered by `project_id`?
   - Does `app/(app)/projects/[id]/page.tsx` pass `isCreator` correctly to `LeftPanel`?
   - Does `left-panel.tsx` only show "Delete project" button when `isCreator === true`?

3. **Plan compliance** — check each component against the plan's code. Note any unexplained divergences.

4. **Type consistency:**
   - Do all components correctly type the `Entry`, `Project`, `ProjectWithMembers` props from `types/index.ts`?
   - Does `realtime-entries.tsx` cast `payload.new` correctly to `Entry`?

5. **Error handling:**
   - Does `cover-upload.tsx` handle upload pending state (disable buttons, show opacity)?
   - Does `left-panel.tsx` show invite send confirmation or error to the user?
   - Does `new-project-modal.tsx` show error messages from the server action?

6. **Tailwind config alignment** — do components use `text-orange`, `bg-surface`, `border-border`, `text-text-muted` etc. as defined in `tailwind.config.ts`? Or are there hardcoded hex values that should be design tokens?

7. **Code-smell red flags** — `'use client'` missing on interactive components, missing `key` props in lists, direct `window` access without SSR guard.

## Required Report

Write your report to **exactly** this path:

```
C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\reviews\round-1\rev-3.md
```

Use the format from `dispatch/review-template.md`. End with: **PASS**, **PASS WITH NOTES**, or **FAIL**.

## Tests to Run

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run
npm run build 2>&1 | tail -30
```

Include both outputs in your report.

## When You're Done

After writing your report, do nothing else.
