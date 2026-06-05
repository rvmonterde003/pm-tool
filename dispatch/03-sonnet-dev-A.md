**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-A** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 1**. Before doing anything, verify Phase 0 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see: `dev-0-done.md`

If it is missing, **stop** and write `dispatch/progress/dev-A-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 4** from the plan in full.

Open the plan file, navigate to Task 4 ("Supabase Clients, Middleware & Shared Types"), and follow every step exactly. This task follows TDD: write the failing test first, verify it fails, then implement.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `types/index.ts`
- `types/index.test.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `middleware.ts`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

After implementing types (Step 3), run:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run types/index.test.ts
```

Expected: **PASS** (2 tests). Fix any failures before committing.

## Commits

Commit as specified in the plan (Task 4 Step 8):
```bash
git add lib/ middleware.ts types/
git commit -m "feat: add Supabase clients, middleware, and shared types"
```

## Done Signal

Write `dispatch/progress/dev-A-done.md`:

```markdown
# dev-A complete

## Tasks
- Task 4: Created Supabase browser + server clients, route-protection middleware, and shared TypeScript types

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run types/index.test.ts: [N passed]
```

## Hard Stops

Stop and write `dispatch/progress/dev-A-blocked.md` if:
- Phase 0 is not complete
- `@supabase/ssr` is not available (npm install must be done first — check `node_modules/@supabase`)
- Tests cannot pass within the bounds of your file list
