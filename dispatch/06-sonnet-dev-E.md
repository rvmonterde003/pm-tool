**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-E** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 2**. Before doing anything, verify Phase 1 foundations are complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`

If `dev-A-done.md` is missing, **stop** and write `dispatch/progress/dev-E-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 8** from the plan, then add the `updateCover` action from **Task 13 Step 1**.

### Part 1 — Task 8: "Server Actions — Projects"

Follow Task 8 in the plan exactly (write failing tests, verify they fail, implement, verify they pass, commit).

### Part 2 — Task 13 Step 1: Add `updateCover` to projects.ts

**After Task 8 is committed**, open the plan and find Task 13 ("Project Detail — Left Panel"), Step 1 ("Add updateCover action to `lib/actions/projects.ts`"). Execute that step only — append the `updateCover` function to `lib/actions/projects.ts` exactly as shown in the plan. Do NOT do any other steps from Task 13.

Commit this addition separately:
```bash
git add lib/actions/projects.ts
git commit -m "feat: add updateCover server action"
```

**Why you own this:** Task 13 modifies `lib/actions/projects.ts` which you created. To avoid file conflicts with other parallel agents, you complete the full file and no other agent touches it.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `lib/actions/projects.ts`
- `lib/actions/projects.test.ts`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

After Task 8 implementation:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run lib/actions/projects.test.ts
```

Expected: **PASS** (2 tests). Fix any failures before committing.

After adding `updateCover` (Part 2), re-run to confirm no regressions:
```bash
npx vitest run lib/actions/projects.test.ts
```

## Commits

- Task 8 Step 5: `git commit -m "feat: add project server actions (create, delete, updateProgress)"`
- Part 2: `git commit -m "feat: add updateCover server action"`

## Done Signal

Write `dispatch/progress/dev-E-done.md`:

```markdown
# dev-E complete

## Tasks
- Task 8: Project server actions — createProject, deleteProject, updateProgress with TDD
- Task 13 Step 1: Added updateCover action to lib/actions/projects.ts

## Commits
[output of `git log --oneline -4`]

## Tests
npx vitest run lib/actions/projects.test.ts: 2 passed
```

## Hard Stops

Stop and write `dispatch/progress/dev-E-blocked.md` if:
- `dev-A-done.md` missing
- Tests cannot pass within your file list
- You need to import from a module that doesn't exist yet
