**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-F** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 2**. Before doing anything, verify Phase 1 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`

If either `dev-A-done.md` or `dev-B-done.md` is missing, **stop** and write `dispatch/progress/dev-F-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 9** from the plan in full.

Open the plan file, navigate to Task 9 ("Server Actions — Entries"), and follow every step exactly. This task follows TDD.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `lib/actions/entries.ts`
- `lib/actions/entries.test.ts`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run lib/actions/entries.test.ts
```

Expected: **PASS** (1 test). Fix any failures before committing.

## Commits

Task 9 Step 5: `git commit -m "feat: add entry server action with 2-per-week validation"`

## Done Signal

Write `dispatch/progress/dev-F-done.md`:

```markdown
# dev-F complete

## Tasks
- Task 9: Entry server action with 2-per-week enforcement, attachment upload, week_start calculation

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run lib/actions/entries.test.ts: 1 passed
```

## Hard Stops

Stop and write `dispatch/progress/dev-F-blocked.md` if:
- `dev-A-done.md` or `dev-B-done.md` missing
- Tests cannot pass within your file list
