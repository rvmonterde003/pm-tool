**Recommended model for this tab:** `opus` — set with `/model opus` before continuing.

You are **rev-2** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

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
- Tasks under your review: Tasks 4, 5, 8, 9, 10
- Files you must inspect:
  - `types/index.ts`
  - `types/index.test.ts`
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `middleware.ts`
  - `lib/utils/week.ts`
  - `lib/utils/week.test.ts`
  - `lib/utils/cn.ts`
  - `lib/actions/projects.ts`
  - `lib/actions/projects.test.ts`
  - `lib/actions/entries.ts`
  - `lib/actions/entries.test.ts`
  - `lib/actions/members.ts`
  - `app/api/invite/route.ts`

## What to Check

1. **Spec compliance:**
   - Spec "Data Model" section: do `types/index.ts` types match all spec-defined fields exactly?
   - Spec "Entry Validation": does `createEntry` in `entries.ts` count by `(project_id, week_start)` and return error at ≥2?
   - Spec "Invite System": does `joinViaToken` in `members.ts` check BOTH `projects.invite_token` (shareable) AND `project_invites.token` (email)?
   - Spec "File Storage": does `createProject` upload to `covers/{user.id}/{timestamp}.{ext}`, and does `updateCover` delete the old file before uploading the new one?

2. **Plan compliance** — does the code match what was specified in the plan steps?

3. **Test quality:**
   - `projects.test.ts`: covers empty name and out-of-range progress. Any other validation paths worth testing?
   - `entries.test.ts`: covers all-empty fields. Does it also test the week count logic?
   - `week.test.ts`: 3 tests — Monday input, Wednesday input, Sunday input. Are edge cases covered?

4. **Type consistency:**
   - Do `ActionResult<T>` return types in all actions match the `ActionResult` type defined in `types/index.ts`?
   - Does `createEntry` return `ActionResult<Entry>` and does the Entry type match what Supabase returns?

5. **Error handling:**
   - Does `createProject` handle Supabase storage upload failure?
   - Does `joinViaToken` handle the case where the user is already a member (upsert should handle this, verify)?

6. **Security:**
   - Does `middleware.ts` correctly protect `/dashboard` and `/projects/*` but leave `/` and `/invite/*` public?
   - Does `deleteProject` server action verify `created_by = user.id` at the application layer (in addition to RLS)?

7. **Code-smell red flags** — placeholder env vars, hardcoded values, missing `'use server'` directives on action files.

## Required Report

Write your report to **exactly** this path:

```
C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\reviews\round-1\rev-2.md
```

Use the format from `dispatch/review-template.md`. End with: **PASS**, **PASS WITH NOTES**, or **FAIL**.

## Tests to Run

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run
```

Include the complete output in your report.

## When You're Done

After writing your report, do nothing else.
