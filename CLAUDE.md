# KALA — instructions for Claude

Project memory (current state, history, next steps) — auto-loaded:

@MEMORY.md

## Session workflow

1. **Start:** the memory above is already in context — don't re-explore the repo to rebuild context. Only open files the current task needs. `README.md` has the folder structure if needed.
2. **During:** after finishing a meaningful chunk of work (a feature, fix, or decision), update `MEMORY.md` right away — don't wait for the end, since a session can close without warning.
3. **End — `/wrap-up`, or when the user says "wrap up", "save memory" or similar:** update `MEMORY.md`:
   - refresh the **Snapshot** date and status,
   - add what was done under **Done** (dated heading),
   - adjust **Open / Next up** and **Decisions & gotchas**,
   - add one line to **Session log** (newest first).
   Keep it concise — summarize, don't paste code. Remove items that are no longer true.

## Rules

- Faithful port of the design canvas — don't reinterpret visuals; re-read the canvas when unsure.
- Keep motion data attributes (`data-reveal`, `data-words`, `data-spin`, …) intact.
- Windows PowerShell 5.1: no `&&`; use `;` / `if ($?) { }`.
