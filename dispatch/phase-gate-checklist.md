# Phase Gate Checklist — Realign

Run through this **before launching the next phase**. Skip nothing.

---

## Before Phase 1 (after Phase 0)

### 1. dev-0 wrote done.md
```bash
ls dispatch/progress/
```
Expected: `dev-0-done.md`

### 2. Scaffold committed
```bash
git log --oneline -3
```
Expected: "chore: scaffold Next.js project with Tailwind + Vitest config"

### 3. `package.json` and `node_modules` exist
```bash
ls package.json && ls node_modules | head -3
```

---

## Before Phase 2 (after Phase 1)

### 1. All Phase 1 agents wrote done.md
```bash
ls dispatch/progress/
```
Expected: `dev-0-done.md`, `dev-1-done.md`, `dev-A-done.md`, `dev-B-done.md`

### 2. Supabase migrations run (MANUAL STEP — you must do this)
- Log in to https://supabase.com → your project → SQL Editor
- Run `supabase/migrations/001_schema.sql`
- Run `supabase/migrations/002_rls.sql`
- Verify 6 tables exist in the Table Editor
- Verify Storage buckets `covers` (public) and `attachments` (private) exist

### 3. Types and utils committed
```bash
git log --oneline -8
```
Expected commits for: types, Supabase clients, middleware, week utils, cn util

### 4. Tests green
```bash
npx vitest run
```
Expected: `types/index.test.ts` and `lib/utils/week.test.ts` pass

---

## Before Phase 3 (after Phase 2)

### 1. All Phase 2 agents wrote done.md
```bash
ls dispatch/progress/
```
Expected: all Phase 1 files plus `dev-D-done.md`, `dev-E-done.md`, `dev-F-done.md`, `dev-G-done.md`

### 2. Tests green
```bash
npx vitest run
```
Expected: all tests pass including `projects.test.ts` and `entries.test.ts`

### 3. Server actions committed
```bash
git log --oneline -15
```
Expected commits for: app shell + toast, project actions + updateCover, entry actions, members + email API

### 4. App shell renders (smoke check)
```bash
npm run dev
```
Open `http://localhost:3000` — should show the Realign sign-in page.

---

## Before Phase 4 (after Phase 3)

### 1. All Phase 3 agents wrote done.md
```bash
ls dispatch/progress/
```
Expected: all prior files plus `dev-C-done.md`, `dev-H-done.md`, `dev-I-done.md`, `dev-J-done.md`

### 2. Tests green
```bash
npx vitest run
```

### 3. Dashboard renders
Start the dev server and sign in. `/dashboard` should show the honeycomb canvas and "New Project" card.

---

## Before Phase 5 (after Phase 4)

### 1. dev-K wrote done.md
```bash
ls dispatch/progress/
```
Expected: all prior files plus `dev-K-done.md`

### 2. Full app smoke test
- Sign in → dashboard → create a project with a cover image → click card → project detail shows
- Add an entry → it appears in the feed
- Copy shareable link → paste in incognito → join the project

---

## Before Review Round (after Phase 5)

### 1. dev-L wrote done.md + all prior done.md exist
```bash
ls dispatch/progress/
```
Expected: 14 `done.md` files (dev-0 through dev-L)

### 2. Build passes
```bash
npm run build
```
Expected: no TypeScript errors, successful build output.

### 3. Full test suite green
```bash
npx vitest run
```
Expected: all tests pass.

### 4. Reviewer briefs reference correct files
Open `15-opus-rev-1.md`, `16-opus-rev-2.md`, `17-opus-rev-3.md`. Verify each lists files that exist on disk.

---

## After Review Round — Before Synthesis

### 1. All 3 reports written
```bash
ls dispatch/reviews/round-1/
```
Expected: `rev-1.md`, `rev-2.md`, `rev-3.md`

### 2. Tally verdicts
- All PASS or PASS WITH NOTES → paste `synthesis-prompt.md` to main chat; it will write `done-summary.md`.
- Any FAIL → paste `synthesis-prompt.md` to main chat; it will write `dispatch/round-2/` fix briefs.

---

## Hard Stops

If any of these, **stop** and consult the main chat:
- An agent committed to files outside its ownership list (`git log --stat`)
- The same file has commits from two different agents
- Tests pass in an agent's `done.md` but fail when you run them locally
- Two reviewers contradict each other on the same finding
