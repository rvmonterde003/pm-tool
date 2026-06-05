**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-C** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 3**. Before doing anything, verify Phase 2 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`, `dev-D-done.md`, `dev-E-done.md`, `dev-F-done.md`, `dev-G-done.md`

If any of `dev-D-done.md`, `dev-E-done.md`, `dev-F-done.md`, or `dev-G-done.md` are missing, **stop** and write `dispatch/progress/dev-C-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 6** then **Task 17** from the plan, in order.

- Task 6: "Root Layout & Auth Page"
- Task 17: "Invite Landing Page"

Open the plan file, navigate to each task, and follow every step exactly.

**Why these two together:** Task 17 (Steps 2–3) modifies `app/page.tsx` and `components/auth/auth-form.tsx` — both created by Task 6. They must be done by the same agent in sequence.

**Important note on create-next-app generated files:** `app/layout.tsx` and `app/globals.css` may already exist from the scaffold (Task 1). If so, **replace** their contents with exactly what the plan specifies in Task 6 Steps 1–2. Do not merge — overwrite.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/auth/auth-form.tsx`
- `app/invite/[token]/page.tsx`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No unit tests for these components. Verify TypeScript compiles:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx tsc --noEmit 2>&1 | head -30
```

Run full test suite for regressions:
```bash
npx vitest run
```

## Commits

Commit each task separately:
- Task 6 Step 6: `git commit -m "feat: add root layout and magic-link auth page"`
- Task 17 Step 4: `git commit -m "feat: add invite landing page and post-auth invite redirect"`

## Done Signal

Write `dispatch/progress/dev-C-done.md`:

```markdown
# dev-C complete

## Tasks
- Task 6: Root layout with Inter font, globals.css, auth page with magic-link AuthForm
- Task 17: Invite landing page (/invite/[token]) + post-auth invite redirect via searchParams

## Commits
[output of `git log --oneline -4`]

## Tests
npx vitest run: [N passed]
npx tsc --noEmit: [pass or errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-C-blocked.md` if:
- Any Phase 2 done files are missing
- TypeScript errors you cannot resolve within your file list
- A task requires modifying a file not in your ownership list
