**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-B** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 1**. Before doing anything, verify Phase 0 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`

If it is missing, **stop** and write `dispatch/progress/dev-B-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 5** from the plan in full.

Open the plan file, navigate to Task 5 ("Utility Functions"), and follow every step exactly. This task follows TDD: write failing tests first for week.ts, verify they fail, implement, verify they pass. Then create cn.ts.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `lib/utils/week.ts`
- `lib/utils/week.test.ts`
- `lib/utils/cn.ts`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run lib/utils/week.test.ts
```

Expected: **PASS** (3 tests). Fix any failures before committing.

## Commits

Commit as specified in the plan (Task 5 Step 6):
```bash
git add lib/utils/
git commit -m "feat: add week and cn utility functions"
```

## Done Signal

Write `dispatch/progress/dev-B-done.md`:

```markdown
# dev-B complete

## Tasks
- Task 5: Created getCurrentMonday(), getWeekRange() utilities and cn() Tailwind merge helper

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run lib/utils/week.test.ts: 3 passed
```

## Hard Stops

Stop and write `dispatch/progress/dev-B-blocked.md` if:
- Phase 0 is not complete (`node_modules/date-fns` must exist)
- Tests cannot pass within the bounds of your file list
