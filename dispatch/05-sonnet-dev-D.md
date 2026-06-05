**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-D** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 2**. Before doing anything, verify Phase 1 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`

(dev-1-done.md may or may not be present — the DB migrations are written by dev-1 and run manually by the human. Your tasks don't depend on the DB being live, only on Types and Utils being committed.)

If `dev-A-done.md` or `dev-B-done.md` are missing, **stop** and write `dispatch/progress/dev-D-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 7** then **Task 18** from the plan, in order.

- Task 7: "Honeycomb Background & App Shell"
- Task 18: "Toast Notification Component"

Open the plan file, navigate to each task, and follow every step exactly.

**Why these two together:** Task 18 (Step 2) modifies `app/(app)/layout.tsx` which Task 7 creates. They must be done by the same agent in sequence.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `components/ui/honeycomb-bg.tsx`
- `app/(app)/layout.tsx`
- `components/auth/sign-out-button.tsx`
- `components/ui/toast.tsx`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No unit tests for these components. After Task 7 Step 4, verify the dev server starts without errors:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npm run build 2>&1 | tail -20
```

Expected: build output with no TypeScript errors (some "missing env" warnings are okay at this stage).

Run the full test suite to confirm no regressions:

```bash
npx vitest run
```

## Commits

Commit each task separately as specified in the plan:
- Task 7 Step 5: `git commit -m "feat: add honeycomb background and authenticated app shell"`
- Task 18 Step 3: `git commit -m "feat: add toast notification system"`

## Done Signal

Write `dispatch/progress/dev-D-done.md`:

```markdown
# dev-D complete

## Tasks
- Task 7: Created HoneycombBg SVG component, app shell layout with sticky nav, SignOutButton
- Task 18: Created ToastProvider + useToast hook, wired into app shell layout

## Commits
[output of `git log --oneline -4`]

## Tests
npx vitest run: [N passed] (no new tests for these tasks — UI components)
npm run build: [pass/errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-D-blocked.md` if:
- `dev-A-done.md` or `dev-B-done.md` missing
- TypeScript errors you cannot resolve within your file list
- Task seems to require modifying a file not in your ownership list
