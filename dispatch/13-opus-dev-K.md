**Recommended model for this tab:** `opus` — set with `/model opus` before continuing. This is the integration phase; Opus gives the best results for cross-module wiring.

You are **dev-K** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 4**. Before doing anything, verify Phase 3 is complete:

```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\dispatch\progress\"
```

You should see all of: `dev-0-done.md`, `dev-A-done.md`, `dev-B-done.md`, `dev-C-done.md`, `dev-D-done.md`, `dev-E-done.md`, `dev-F-done.md`, `dev-G-done.md`, `dev-H-done.md`, `dev-I-done.md`, `dev-J-done.md`

If any Phase 3 done files are missing (`dev-C`, `dev-H`, `dev-I`, `dev-J`), **stop** and write `dispatch/progress/dev-K-blocked.md`. Do not proceed.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 16** from the plan in full.

Open the plan file, navigate to Task 16 ("Project Detail Page with Realtime"), and follow every step exactly.

This task wires together all the components built in Phase 3 (LeftPanel from dev-I, RightPanel/RealtimeEntries from dev-J) into the full project detail page with Supabase Realtime subscription.

**Before writing code**, verify these files exist (the components you'll import):
```bash
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\components\detail\left-panel.tsx"
ls "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\components\detail\right-panel.tsx"
```

**Task 16 Step 3 (verify project detail renders):** Run the dev server smoke test. This requires `.env.local` to exist. If it doesn't, skip the smoke test and note this in your done signal. Run the build check instead:
```bash
npm run build 2>&1 | tail -20
```

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `app/(app)/projects/[id]/page.tsx`
- `components/detail/realtime-entries.tsx`

You may **read** any file. You may **not** modify any file outside the list above.

## Tests

No unit tests for this integration. Verify TypeScript compiles cleanly:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx tsc --noEmit 2>&1 | head -30
```

Run full test suite:
```bash
npx vitest run
```

Expected: all existing tests still pass. If any fail, investigate carefully — do not modify test files outside your ownership list.

## Commits

Task 16 Step 4: `git commit -m "feat: add project detail page with Realtime entry subscription"`

## Done Signal

Write `dispatch/progress/dev-K-done.md`:

```markdown
# dev-K complete

## Tasks
- Task 16: Project detail page (server component fetching project + entries), RealtimeEntries client component with Supabase channel subscription

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run: [N passed]
npx tsc --noEmit: [pass or errors noted]
npm run build: [pass or errors noted]
```

## Hard Stops

Stop and write `dispatch/progress/dev-K-blocked.md` if:
- Any Phase 3 done files missing
- `LeftPanel`, `RightPanel`, or other imported components don't exist at expected paths
- TypeScript errors you cannot resolve within your file list
- Supabase Realtime types are not available (check `node_modules/@supabase`)
