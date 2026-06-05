# rev-[N] Review Report — Round [ROUND_N]

**Reviewer scope:** [list of files reviewed]
**Plan tasks covered:** [list of task numbers]
**Spec sections referenced:** [list of spec sections]

## Verdict

**[PASS | PASS WITH NOTES | FAIL]**

## Summary

[1-3 sentences. What was reviewed, what was found at the headline level.]

## Findings

### Defects (FAIL)

Omit this section entirely if verdict is PASS or PASS WITH NOTES with no defects.

```
- **D1:** [short title]
  - File: `path/to/file.ts:42-58`
  - Spec/Plan reference: [spec section or Task N step M]
  - Observed: [what the code does]
  - Expected: [what spec/plan requires]
  - Suggested fix: [one or two lines on the change]
  - Severity: [blocker | high | medium]
```

### Notes (non-blocking)

```
- **N1:** [short title] — `path/to/file.ts:42` — [one-line description]
```

## Tests Run

```
[exact command and final output line, e.g.:]
$ npx vitest run
Test Files  3 passed (3)
Tests       8 passed (8)
```

## What I Did NOT Check

[Files in scope you couldn't fully review, and why. Be honest about gaps.]
