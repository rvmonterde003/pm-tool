**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-H** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 3**. Before doing anything, verify Phase 2 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`, `dev-D-done.md`, `dev-E-done.md`

If `dev-D-done.md` or `dev-E-done.md` are missing, **stop** and write `dispatch/progress/dev-H-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 11** then **Task 12** from the plan, in order.

- Task 11: "Project Card Components & New Project Modal"
- Task 12: "Dashboard Page"

Open the plan file, navigate to each task, and follow every step exactly.

**Task 12 Step 3 (verify the app renders):** You can run `npm run dev` to do a quick smoke check, but this requires `.env.local` to exist with valid Supabase credentials. If it doesn't, skip the smoke check and note this in your done signal. The build check is more important:
```bash
npm run build 2>&1 | tail -20
```

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `components/projects/project-card.tsx`
- `components/projects/new-project-card.tsx`
- `components/projects/new-project-modal.tsx`
- `components/projects/project-grid.tsx`
- `app/(app)/dashboard/page.tsx`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No unit tests for these UI components. Verify TypeScript:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx tsc --noEmit 2>&1 | head -30
```

Run full test suite:
```bash
npx vitest run
```

## Commits

- Task 11 Step 4: `git commit -m "feat: add project card, new project card, and create modal"`
- Task 12 Step 4: `git commit -m "feat: add dashboard page with project grid"`

## Done Signal

Write `dispatch/progress/dev-H-done.md`:

```markdown
# dev-H complete

## Tasks
- Task 11: ProjectCard (with overlay/100% ring), NewProjectCard (dashed "+"), NewProjectModal (create form with cover upload)
- Task 12: ProjectGrid (3-col) and Dashboard page (server component fetching projects)

## Commits
[output of `git log --oneline -4`]

## Tests
npx vitest run: [N passed]
npx tsc --noEmit: [pass or errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-H-blocked.md` if:
- `dev-D-done.md` or `dev-E-done.md` missing
- TypeScript errors you cannot resolve within your file list
