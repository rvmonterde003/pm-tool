**Recommended model for this tab:** `sonnet` — set with `/model sonnet` before continuing.

You are **dev-0** for the **Realign** project at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`.

This is a fresh Claude Code session. You have no prior conversation context. Your sole source of truth is the plan file and this brief.

## Phase

You are in **Phase 0**. No prior dependencies — start immediately.

## Plan and Spec

- Plan file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\plans\2026-06-05-realign-implementation.md`
- Spec file: `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt\docs\superpowers\specs\2026-06-05-realign-design.md`

## Your Tasks

Complete **Task 1** from the plan in full.

Open the plan file, navigate to Task 1 ("Project Scaffolding & Configuration"), and follow every step exactly.

**Important context:** The project directory already exists at `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt` and already has a git repo initialized with two committed files (`docs/superpowers/specs/` and `docs/superpowers/plans/`). Do NOT run `git init` again. When `create-next-app` runs, it may ask to initialize a git repo — decline or skip that step since git is already initialized.

`create-next-app` will scaffold into the existing directory. Run it as:
```bash
cd "C:\Users\Admin\Desktop\Personal Projects"
npx create-next-app@latest pm-project-mgmt --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```
When asked about an existing directory, confirm you want to proceed.

## File Ownership — HARD CONSTRAINT

You may **create or modify only** these files:

- `package.json`
- `package-lock.json`
- `next.config.ts` (or `next.config.js` — use `.ts`)
- `tailwind.config.ts`
- `tsconfig.json`
- `vitest.config.ts`
- `vitest.setup.ts`
- `.env.local.example`
- `postcss.config.js` (or `postcss.config.mjs` — created by create-next-app)
- `.gitignore`
- `node_modules/` (npm creates this)
- Any files create-next-app scaffolds automatically

You may **read** any file. You may **not** modify `docs/` or any files outside the list above.

## Tests

After installing Vitest (Task 1 Step 4), verify the config is valid:

```bash
cd "C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt"
npx vitest run
```

No test files exist yet — the expected result is "no test files found" or 0 tests run. This is fine for Phase 0.

## Commits

Commit as specified in the plan (Task 1 Step 7):
```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind + Vitest config"
```

## Done Signal

When Task 1 is complete, write `dispatch/progress/dev-0-done.md` with this exact format:

```markdown
# dev-0 complete

## Tasks
- Task 1: Scaffolded Next.js 14 + TypeScript + Tailwind + Vitest, configured design tokens and next.config.ts

## Commits
[output of `git log --oneline -3`]

## Tests
npx vitest run: 0 test files (expected — no tests yet)
```

## Hard Stops

Stop and write `dispatch/progress/dev-0-blocked.md` if:
- `create-next-app` fails to run
- npm install fails with irresolvable errors
- You cannot reconcile with the existing git repo

Describe what you tried and what failed.
