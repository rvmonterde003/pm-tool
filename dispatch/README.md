# Dispatch — Realign

This folder contains self-contained briefs for executing the implementation plan via **manual fan-out**: open multiple Claude Code tabs and paste each brief into a separate tab.

Plan: `docs/superpowers/plans/2026-06-05-realign-implementation.md`
Spec: `docs/superpowers/specs/2026-06-05-realign-design.md`

## Layout

```
dispatch/
├── README.md                          ← this file (guide)
├── phase-gate-checklist.md            ← guide
├── review-template.md                 ← template
├── synthesis-prompt.md                ← end-of-round paste
│
├── 01-sonnet-dev-0-scaffold.md        ← Phase 0 (1 tab)
│
├── 02-sonnet-dev-1-migrations.md      ← Phase 1 (3 tabs in parallel)
├── 03-sonnet-dev-A.md
├── 04-sonnet-dev-B.md
│
├── 05-sonnet-dev-D.md                 ← Phase 2 (4 tabs in parallel)
├── 06-sonnet-dev-E.md
├── 07-sonnet-dev-F.md
├── 08-sonnet-dev-G.md
│
├── 09-sonnet-dev-C.md                 ← Phase 3 (4 tabs in parallel)
├── 10-sonnet-dev-H.md
├── 11-sonnet-dev-I.md
├── 12-sonnet-dev-J.md
│
├── 13-opus-dev-K.md                   ← Phase 4 (1 tab)
├── 14-sonnet-dev-L.md                 ← Phase 5 (1 tab)
│
├── 15-opus-rev-1.md                   ← Review round (3 tabs in parallel)
├── 16-opus-rev-2.md
├── 17-opus-rev-3.md
│
progress/                              ← agents write *-done.md here
reviews/round-1/                       ← reviewer agents write rev-N.md here
```

## File Naming Convention

```
NN-<model>-<role>.md
```
- `NN` — 2-digit ordinal. Open in order within a phase (all same-phase numbers = open as a batch in parallel).
- `<model>` — set the tab's model with `/model <token>` before pasting.
- Unprefixed files (README, checklist, review-template, synthesis-prompt) are guides — never opened in their own tab.

## How to Run

### Phase 0 (1 tab)
Open one tab → `/model sonnet` → paste `01-sonnet-dev-0-scaffold.md`.
Wait for `progress/dev-0-done.md`. Run phase-gate-checklist.md.

### Phase 1 (3 tabs in parallel)
Open 3 tabs → paste `02-`, `03-`, `04-` one per tab.
Wait for `progress/dev-1-done.md`, `dev-A-done.md`, `dev-B-done.md`. Run checklist.
**Also run the Supabase migrations manually** (see dev-1 brief).

### Phase 2 (4 tabs in parallel)
Open 4 tabs → paste `05-`, `06-`, `07-`, `08-`.
Wait for `dev-D-done.md`, `dev-E-done.md`, `dev-F-done.md`, `dev-G-done.md`. Run checklist.

### Phase 3 (4 tabs in parallel)
Open 4 tabs → paste `09-`, `10-`, `11-`, `12-`.
Wait for `dev-C-done.md`, `dev-H-done.md`, `dev-I-done.md`, `dev-J-done.md`. Run checklist.

### Phase 4 (1 tab)
Open one tab → `/model opus` → paste `13-opus-dev-K.md`.
Wait for `dev-K-done.md`. Run checklist.

### Phase 5 (1 tab)
Open one tab → paste `14-sonnet-dev-L.md`.
Wait for `dev-L-done.md`. Run checklist.

### Review Round (3 tabs in parallel)
Open 3 tabs → `/model opus` on each → paste `15-`, `16-`, `17-`.
Wait for `reviews/round-1/rev-1.md`, `rev-2.md`, `rev-3.md`.

### Synthesis (back in this main chat)
Once all 3 reviewer reports exist, paste `synthesis-prompt.md` back to the main chat.

## Rules

- **One file = one agent.** Never open a brief in two tabs simultaneously.
- **No phase skipping.** Use `phase-gate-checklist.md` at every transition.
- **No context sharing.** Each tab is a fresh session — the brief is everything the agent needs.
- **If an agent writes `*-blocked.md`**: stop, read it, resolve it before retrying.
