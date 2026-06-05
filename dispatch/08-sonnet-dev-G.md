**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-G** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 2**. Before doing anything, verify Phase 1 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`, `dev-A-done.md`

If `dev-A-done.md` is missing, **stop** and write `dispatch/progress/dev-G-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 10** from the plan in full.

Open the plan file, navigate to Task 10 ("Server Actions — Members & Invites + Email API Route"), and follow every step exactly.

**Note on the email sender address:** In `app/api/invite/route.ts`, the plan uses `noreply@yourdomain.com` as a placeholder. Replace it with `onboarding@resend.dev` (Resend's shared sandbox domain — works for development without a verified domain). The production value will be set by the user before deploying.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `lib/actions/members.ts`
- `app/api/invite/route.ts`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No automated unit tests for this task (network calls to Resend are not unit-testable without mocking). After writing both files, verify TypeScript compiles cleanly:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only "cannot find module env" style errors which are acceptable at this stage).

Run full test suite for regressions:
```bash
npx vitest run
```

## Commits

Task 10 Step 3: `git commit -m "feat: add member invite actions and email API route"`

## Done Signal

Write `dispatch/progress/dev-G-done.md`:

```markdown
# dev-G complete

## Tasks
- Task 10: joinViaToken action (handles both shareable link + email invite), sendEmailInvite action, Resend email API route

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run: [N passed] (no new unit tests for this task)
```

## Hard Stops

Stop and write `dispatch/progress/dev-G-blocked.md` if:
- `dev-A-done.md` missing
- TypeScript errors you cannot resolve within your file list
