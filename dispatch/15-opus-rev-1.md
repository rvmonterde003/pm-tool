**Recommended model for this tab:** `opus` — set with `/model opus` before continuing.

You are **rev-1** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file, the spec file, and the source files listed below.

## Read-Only — HARD CONSTRAINT

- You may **read** any file.
- You may **run tests** to confirm what you observe.
- You may **not** edit, create, or delete source files.
- You may **not** commit.
- The only file you create is your report at the path specified below.

## Plan, Spec, and Scope

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`
- Tasks under your review: Tasks 1, 2, 3, 6, 17
- Files you must inspect:
  - `supabase/migrations/001_schema.sql`
  - `supabase/migrations/002_rls.sql`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/globals.css`
  - `components/auth/auth-form.tsx`
  - `app/invite/[token]/page.tsx`

## What to Check

For each file in your scope, verify:

1. **Spec compliance** — does the implementation match the spec's data model (Task 2–3) and auth/invite flow (Task 6, 17)?
   - Spec sections: "Data Model", "Pages & Routing" (`/` and `/invite/[token]`), "Auth Flow"
   - Verify all 6 tables exist in the schema with correct columns and types
   - Verify triggers: `handle_new_user` (creates profile on signup), `add_creator_as_member`
   - Verify RLS: members can read/write; only creator can delete project; invite tokens are publicly readable
   - Verify invite page handles both shareable link tokens and email invite tokens
   - Verify auth page redirects to `/invite/[token]` if `?invite=` param is present after sign-in

2. **Plan compliance** — does the code match what the plan specified?

3. **Test quality** — no unit tests for SQL or auth page; note any missing test coverage.

4. **Type consistency** — does `auth-form.tsx` use the `redirectTo` prop correctly? Does `page.tsx` pass it?

5. **Error handling** — does `invite/[token]/page.tsx` handle invalid/expired tokens gracefully?

6. **Security** — RLS check: can a non-member read another user's project data? Does the `is_project_member` helper work correctly?

7. **Code-smell red flags** — any placeholder values (like `yourdomain.com` in email) left in production code paths?

## Required Report

Write your report to **exactly** this path:

```
C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\reviews\round-1\rev-1.md
```

Use the format from `dispatch/review-template.md`. End with one of: **PASS**, **PASS WITH NOTES**, or **FAIL**.

If FAIL: give exact file:line references, what's wrong, and a suggested fix.

## Tests to Run

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run
```

Include the output in your report.

## When You're Done

After writing your report, do nothing else. Do not poll for more work.
