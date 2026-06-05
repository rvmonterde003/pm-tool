The dev and reviewer rounds for **round 1** are complete. Reports are at:

```
dispatch/reviews/round-1/
  rev-1.md
  rev-2.md
  rev-3.md
```

Please synthesize them into the next round's dispatch.

## Your synthesis process

1. **Read every report** in `dispatch/reviews/round-1/`. Do not yet read the source files those reports describe.

2. **Tally verdicts** and list:
   - All-PASS or PASS-WITH-NOTES files → no further work needed.
   - FAIL files → carry forward to the fix round.

3. **Cluster the defects.** Group by file. Within a file, list each defect as the report stated, with severity.

4. **Now and only now**, read the flagged files. Confirm each defect by inspection. If a defect cannot be confirmed, drop it. Do not re-audit unflagged files.

5. **Decide on next steps:**

   - **All clear?** Write `dispatch/done-summary.md` with: round count, total defects fixed across rounds, final commit hash, and integration test result. Tell me we're done.

   - **More fixes needed?** Partition the fixes into file-disjoint, phase-aware agent buckets. Write briefs to:
     ```
     dispatch/round-2/
       01-<model>-dev-A.md, ...   # fix briefs
       NN-<model>-rev-1.md, ...   # narrower review scope
     ```
     Naming: `NN-<model>-<role>.md` for tab-pasted briefs; no prefix for guides. Restart numbering inside `round-2/`. Pick model per difficulty rubric (haiku=trivial, sonnet=standard, opus=gnarly+all reviewers). Each fix brief must cite the specific defect IDs from `reviews/round-1/`.

6. **Tell me exactly what to do next** — which tabs to open, which briefs to paste, and any phase-gate changes.

## Constraints

- Do not invent tasks not flagged by reviewers.
- Do not expand scope.
- Do not re-architect.
- Do not re-read files marked PASS unless imported by a file being fixed.
