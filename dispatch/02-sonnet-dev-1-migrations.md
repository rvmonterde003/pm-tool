**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-1** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 1**. Before doing anything, verify Phase 0 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`

If it is missing, **stop** and write `dispatch/progress/dev-1-blocked.md` with "waiting for dev-0". Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 2** then **Task 3** from the plan, in order.

Open the plan file, navigate to Task 2 ("Supabase Schema Migrations") and Task 3 ("Row-Level Security Policies"), and follow every step exactly.

**Important note on "Step 2: Run migration" in Tasks 2 and 3:** These steps require the user to manually paste SQL into the Supabase dashboard. You **write the SQL files** and **commit them**, but you **cannot execute them in Supabase**. After you commit, write your done signal and note that the human must run the migrations manually before Phase 2 begins. The phase-gate-checklist.md already includes this manual step.

**Storage buckets (Task 2 Step 3):** You cannot create Supabase Storage buckets from the CLI. Note in your done signal that the human must create them manually.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `supabase/migrations/001_schema.sql`
- `supabase/migrations/002_rls.sql`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No automated tests for SQL migrations. Verify your SQL is syntactically valid by reading it carefully. The human will confirm correctness when running it in Supabase.

## Commits

Commit each task as a separate commit as specified in the plan:
- Task 2: `git commit -m "feat: add database schema migration"`
- Task 3: `git commit -m "feat: add row-level security policies"`

## Done Signal

When both tasks are complete, write `dispatch/progress/dev-1-done.md`:

```markdown
# dev-1 complete

## Tasks
- Task 2: Wrote 001_schema.sql — 6 tables (profiles, projects, project_members, entries, entry_attachments, project_invites) + triggers
- Task 3: Wrote 002_rls.sql — RLS policies for all tables + storage buckets

## Commits
[output of `git log --oneline -4`]

## Human Actions Required Before Phase 2
1. Run supabase/migrations/001_schema.sql in Supabase SQL Editor
2. Run supabase/migrations/002_rls.sql in Supabase SQL Editor
3. Create Storage bucket "covers" (Public: ON)
4. Create Storage bucket "attachments" (Public: OFF)

## Tests
N/A — SQL migrations; verified by inspection
```

## Hard Stops

Stop and write `dispatch/progress/dev-1-blocked.md` if:
- Phase 0 is not complete
- A task contradicts itself and you cannot resolve it
