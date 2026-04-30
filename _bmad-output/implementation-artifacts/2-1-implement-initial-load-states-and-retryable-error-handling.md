# Story 2.1: Implement Initial Load States and Retryable Error Handling

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,  
I want clear feedback while the app loads or fails,  
so that I always understand the current state and next action.

## Acceptance Criteria

1. Given the app requests todos on first load, when data is pending, then a loading state is rendered, and loading indicators are announced or accessibly labeled where needed.
2. Given the todos response is empty, when loading completes successfully, then an empty-state message is shown, and it guides the user to create a first todo.
3. Given initial fetch fails, when an error occurs, then an error state with user-readable message is displayed, and a retry action is available and triggers a new fetch attempt.

## Tasks / Subtasks

- [ ] Refine initial-load UX in `src/pages/index.tsx` (AC: 1, 2, 3)
  - [ ] Ensure loading branch is visibly distinct while `GET /api/todos` is in flight (AC: 1).
  - [ ] Add semantics so assistive tech can perceive loading versus ready: e.g. `aria-busy` on the todos panel while loading, and/or a `role="status"` (or equivalent) message for loading that does not steal focus from the rest of the page (AC: 1). The outer list section already has `aria-live="polite"`; align loading announcements with it so duplicated noisy updates are avoided.
  - [ ] Keep/create empty-state copy that explicitly invites adding a first todo (AC: 2). Preserve current behavior unless copy or structure must change to meet UX spec.
  - [ ] On initial fetch failure (`fetchTodos` throws or non-OK path), render a readable error plus a labeled **Retry** control that calls the same load routine as the mount effect without requiring full page reload (AC: 3).
  - [ ] While retry runs, show loading indicators consistent with AC 1 (AC: 3).
  - [ ] Preserve existing Epic 1 behavior: create/list/toggle/delete flows, mutation error handling, newest-first ordering, and mounted-guard behavior in initial `useEffect` (regression).

- [ ] Client layer (only if extraction reduces duplication): `src/features/todos/client.js`
  - [ ] No breaking change to success/error semantics of `fetchTodos`; Epic 2.2+ still depend on the same envelope (regression).

- [ ] Tests: extend `tests/home-page.ui.test.tsx` (and only add other suites if justified) (AC: 1–3)
  - [ ] Assert loading text (or designated status region) appears while first fetch unresolved; then resolves to list or empty (AC: 1).
  - [ ] Assert successful empty-list path still surfaces guidance to add a first todo (AC: 2).
  - [ ] Assert failing first fetch shows error messaging and Retry; simulate second successful fetch after Retry and verify list renders (AC: 3).
  - [ ] Maintain existing tests for Epic 1 flows without regressions.

- [ ] Documentation
  - [ ] Update `docs/setup.md` only if verification steps mention load behavior and need the retry path documented.

### Cross-story boundaries (non-goals)

- Story 2.2 covers mutation latency measurement and richer mutation-error copy; avoid changing latency instrumentation here unless required for AC 1–3.
- Story 2.3 covers breakpoint and keyboard/focus auditing at scale; AC 1 only requires proportional accessibility improvements for loading/empty/initial-error (not necessarily full breakpoint matrix).

## Dev Notes

Story 2.1 is Epic 2’s opener. Functional scope is FR-011 (initial load state branching): loading, empty, error-with-retry, and list. Align with UX intent: explicit state branches, retry on recoverable failures, calm non-blocking wording. [Source: docs/prd.md#Journey 4] [Source: _bmad-output/planning-artifacts/ux-design-specification.md § state panels / RetryActionBar pattern]

### Current code intelligence (`UPDATE` surfaces)

#### `src/pages/index.tsx`

- **Today:** Mount `useEffect` calls internal `load()`: sets `isLoading(true)`, clears `loadError`, awaits `fetchTodos()`, sets todos or catches to `loadError`, then `isLoading(false)` with a `mounted` flag.
- **Today:** Rendering: paragraph `Loading todos...`; error is `role="status"` text only (**no Retry**).
- **Today:** Empty: `No todos yet. Add your first task above.`
- **Story change:** Add retry affordance and wire it to re-run fetch; tighten loading/error/empty semantics for accessibility; avoid global flags that block the create form while loading or retrying.
- **Preserve:** Checkbox/delete row actions, per-item pending/errors, sort order helpers, validation and create mutation behavior.

#### `src/features/todos/client.js`

- **Today:** `fetchTodos` already maps API errors via `parseErrorMessage`.
- **Story change:** Prefer keeping fetch logic centralized; refactor page only unless a tiny shared helper avoids duplicated retry wiring.

### Architecture compliance

- Initial load branching remains explicit (`loading | empty | error | list`); mutations keep operation-scoped flags. [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Process patterns require **retry affordance for initial load failure**. [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns – Loading State Patterns]
- Maintain API success/error envelopes; do not reshape responses. [Source: docs/architecture.md] [Source: docs/api.md]

### Prior epic intelligence (continuity after Story 1.4)

- Home page intentionally uses Vitest + Testing Library with `fetch` stubbed globally; extend the same harness.
- Mounted guard exists for initial fetch; reused load for Retry must honor the same pattern (abort or guard state updates after unmount).
- Do not regress Story 1.4 toggle/delete/error tests.

### Git intelligence summary

- Recent work progressed stories through create-story, implementation, sprint status updates (`ready-for-dev` → `review` → `done`). Keep deltas scoped per story file.

### Latest technical information (locked to repo)

- Next.js `^15.2.3`, React `^19.0.0`, Vitest `^4.1.5`, `@testing-library/react` `^16.3.2`, Prisma `^6.6.0`. No mandated upgrades for Story 2.1.

### Project structure notes

- Brownfield codebase uses **`src/pages/index.tsx`** (Pages Router entry for home). Architectural diagrams may reference `src/app`; implementation must follow actual paths used in Epic 1. [Source: _bmad-output/implementation-artifacts/1-4-implement-complete-and-delete-todo-interactions.md § Project Structure Notes]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1: Implement Initial Load States and Retryable Error Handling]
- [Source: docs/prd.md – FR-011]
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns – Loading State Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md – state communication, RetryActionBar / StatePanel]
- [Source: tests/home-page.ui.test.tsx]

## Dev Agent Record

### Agent Model Used

(Story creation workflow)

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed — comprehensive developer guide created for Epic 2.1 focusing on retryable initial load failures and accessibility of loading/empty/error branches relative to existing `src/pages/index.tsx` implementation.

### File List

- _bmad-output/implementation-artifacts/2-1-implement-initial-load-states-and-retryable-error-handling.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-04-30: Story authored via `bmad-create-story`; sprint tracking set to ready-for-dev for `2-1-implement-initial-load-states-and-retryable-error-handling`; epic-2 activated to in-progress.
