**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-J** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 3**. Before doing anything, verify Phase 2 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`, `dev-F-done.md`

If `dev-F-done.md` is missing, **stop** and write `dispatch/progress/dev-J-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 14** then **Task 15** from the plan, in order.

- Task 14: "Entry Components"
- Task 15: "Entries Feed & Right Panel"

Open the plan file, navigate to each task, and follow every step exactly.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `components/entries/entry-card.tsx`
- `components/entries/add-entry-modal.tsx`
- `components/entries/entries-feed.tsx`
- `components/detail/right-panel.tsx`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No unit tests for these components. Verify TypeScript:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx tsc --noEmit 2>&1 | head -30
```

Run full test suite:
```bash
npx vitest run
```

## Commits

- Task 14 Step 3: `git commit -m "feat: add entry card and add-entry modal"`
- Task 15 Step 3: `git commit -m "feat: add entries feed with monthly pagination and right panel"`

## Done Signal

Write `dispatch/progress/dev-J-done.md`:

```markdown
# dev-J complete

## Tasks
- Task 14: EntryCard (bento cells: shipped/slipped/blocking + attachments), AddEntryModal (3 textareas + file attachments)
- Task 15: EntriesFeed (monthly pagination, week limit enforcement), RightPanel wrapper

## Commits
[output of `git log --oneline -4`]

## Tests
npx vitest run: [N passed]
npx tsc --noEmit: [pass or errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-J-blocked.md` if:
- `dev-F-done.md` missing
- TypeScript errors you cannot resolve within your file list
