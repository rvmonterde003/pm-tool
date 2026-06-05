**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-L** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 5**. Before doing anything, verify Phase 4 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see all prior done files including `dev-K-done.md`.

If `dev-K-done.md` is missing, **stop** and write `dispatch/progress/dev-L-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 19** from the plan in full.

Open the plan file, navigate to Task 19 ("Deployment Configuration"), and follow every step exactly.

**What this task does:**
- Documents required Vercel environment variables (Step 1)
- Notes the Resend sender address update in `app/api/invite/route.ts` (Step 2)
- Notes the Supabase redirect URL configuration (Step 3)
- Runs the full test suite (Step 4)
- Runs the build check (Step 5)
- Commits and pushes (Step 6 — only push if the user has set up a remote; otherwise just commit)

**Step 2 — Update Resend sender:** In `app/api/invite/route.ts`, the sender is currently `onboarding@resend.dev`. This is correct for development. If the user has a verified Resend domain, update it. Otherwise, leave it as is and note this in your done signal.

**Step 6 — Git push:** Only run `git push origin main` if a remote origin exists:
```bash
git remote -v
```
If no remote is configured, skip the push step and note in your done signal that the user should add a remote and push manually.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `app/api/invite/route.ts` (only to update the sender address if appropriate)

You do **not** need to create new source files for this task — it's primarily verification and configuration.

You may **read** any file. You may **not** modify any other source file.

## Tests

Run the full test suite:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run
```

Expected: all tests pass.

Run the build:

```bash
npm run build
```

Expected: no TypeScript errors, successful build.

## Commits

Task 19 Step 6: `git commit -m "chore: deployment configuration"`

If build or tests fail, **do not commit**. Write your done signal with the failures noted so the reviewer can flag them.

## Done Signal

Write `dispatch/progress/dev-L-done.md`:

```markdown
# dev-L complete

## Tasks
- Task 19: Deployment verification — test suite, build check, deployment notes

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run: [full output summary — X passed, X failed]

## Build
npm run build: [pass | fail — note any TypeScript errors]

## Deployment Notes
- Remote configured: [yes/no]
- Pushed to remote: [yes/no — if no, user must run: git remote add origin <url> && git push -u origin main]
- Resend sender: [onboarding@resend.dev (dev) | custom domain set]
- .env.local exists: [yes/no]
```

## Hard Stops

Stop and write `dispatch/progress/dev-L-blocked.md` if:
- `dev-K-done.md` missing
- Build fails with errors you cannot fix within your single file ownership (`app/api/invite/route.ts`)
- Tests fail in a way that requires touching files outside your ownership list — note the failures, write done signal anyway so the reviewer can log them
