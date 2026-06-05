**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-I** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 3**. Before doing anything, verify Phase 2 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`, `dev-E-done.md`, `dev-G-done.md`

If `dev-E-done.md` or `dev-G-done.md` are missing, **stop** and write `dispatch/progress/dev-I-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 13 Steps 2–4** from the plan only.

Open the plan, navigate to Task 13 ("Project Detail — Left Panel"), and execute:
- **Step 2: Create CoverUpload component** → creates `components/detail/cover-upload.tsx`
- **Step 3: Create LeftPanel** → creates `components/detail/left-panel.tsx`
- **Step 4: Commit**

**Do NOT execute Task 13 Step 1** — that step modifies `lib/actions/projects.ts` which is owned by dev-E. dev-E has already completed it. When you write `cover-upload.tsx` and `left-panel.tsx`, the `updateCover` function you import from `lib/actions/projects.ts` will already exist.

**Important imports:** `left-panel.tsx` imports:
- `updateProgress`, `deleteProject`, `updateCover` from `lib/actions/projects.ts` (created + completed by dev-E)
- `sendEmailInvite` from `lib/actions/members.ts` (created by dev-G)
- `CoverUpload` from `./cover-upload` (you create this)

Verify these files exist before starting:
```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\lib\actions\projects.ts"
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\lib\actions\members.ts"
```

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `components/detail/cover-upload.tsx`
- `components/detail/left-panel.tsx`

You may **read** any file. You may **not** modify `lib/actions/projects.ts` or any other file outside the list above.

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

Task 13 Step 4: `git commit -m "feat: add project detail left panel with cover upload, progress, invite"`

## Done Signal

Write `dispatch/progress/dev-I-done.md`:

```markdown
# dev-I complete

## Tasks
- Task 13 (components): CoverUpload (replace/remove controls), LeftPanel (meta, progress, collaborators, invite)

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run: [N passed]
npx tsc --noEmit: [pass or errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-I-blocked.md` if:
- `dev-E-done.md` or `dev-G-done.md` missing
- `lib/actions/projects.ts` doesn't export `updateCover` (dev-E should have added it)
- TypeScript errors you cannot resolve within your file list
