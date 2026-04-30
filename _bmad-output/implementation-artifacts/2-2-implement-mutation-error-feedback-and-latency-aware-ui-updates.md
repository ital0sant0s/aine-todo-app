# Story 2.2: Implement Mutation Error Feedback and Latency-Aware UI Updates

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,  
I want immediate and understandable feedback on todo actions,  
so that I can trust the system response.

## Acceptance Criteria

1. Given create/toggle/delete actions succeed, when API responses are returned, then UI updates are visible within 300ms measured from response receipt to DOM update timestamp in integration tests, and the latency assertion passes for 95/100 local test iterations per mutation type (create/toggle/delete), and interaction states are consistent with server state.
2. Given create/toggle/delete actions fail, when API errors are returned, then a non-blocking, user-readable error message is displayed, and the error message includes operation context (`create`, `toggle`, or `delete`) and recovery guidance, and the interface remains usable for subsequent actions without page reload.

## Tasks / Subtasks

- [ ] Enrich mutation error copy in `src/pages/index.tsx` (AC: 2)
  - [ ] For **create** failures (API path after validation passes): ensure the surfaced message explicitly states the operation (e.g. lead with **Create:** or “Could not create …”) **and** includes short recovery guidance (e.g. retrying the action, checking connection). Preserve use of API `error.message` as the detail when present. (AC: 2)
  - [ ] For **toggle** (PATCH completion) failures: same pattern with **toggle** context and recovery guidance (per-row non-blocking message). (AC: 2)
  - [ ] For **delete** failures: same pattern with **delete** context and recovery guidance. (AC: 2)
  - [ ] Keep messages **non-blocking**: do not disable the whole page, full-page alert, or block the create form after a row-level failure. Other rows and create must stay usable. (AC: 2)
  - [ ] Do **not** change initial load / `loadError` copy for this story unless required to avoid contradictory patterns (Story 2.1). (Regression / scope)

- [ ] Latency verification in integration tests (AC: 1)
  - [ ] Extend `tests/home-page.ui.test.tsx` (preferred) **or** add a focused `tests/*latency*.tsx` suite if isolation is cleaner—keep one clear home for Vitest RTL tests.
  - [ ] Define a repeatable measurement: timestamp **when the mocked fetch for the mutation resolves** (response + body consumed—i.e. when control returns from the mocked `fetch` to app code) and timestamp **when the expected DOM outcome is observable** (e.g. new row text present, checkbox checked state, row removed). Use `performance.now()` deltas. Document in a short comment above the helper. (AC: 1)
  - [ ] For each mutation type (**create**, **toggle**, **delete**), run **100 iterations** in a single test (or three tests) that re-render/mount a fresh tree and perform the happy path with a deterministic fast mock; assert **≥ 95** iterations meet **delta ≤ 300ms**. (AC: 1)
  - [ ] Add at least **one non-loop** assertion per mutation type that successful completion still matches server state already covered (list order, checkbox state, removal) so regressions are not hidden inside the statistical check. May extend existing tests or assert inside the latency loop’s first iteration. (AC: 1)

- [ ] Align existing failure-path tests with new error format (AC: 2 + regression)
  - [ ] Update expectations in `tests/home-page.ui.test.tsx` for create/toggle/delete API errors to match the new operation + recovery wording. (AC: 2)

- [ ] Client / API contract
  - [ ] Keep `src/features/todos/client.js` envelopes and `parseErrorMessage` behavior; formatting for operation context belongs in the page layer unless a tiny shared formatter in `src/features/todos/` reduces duplication **without** changing thrown `Error.message` semantics for callers that expect raw API text. Prefer page-level formatter for clarity. (Regression)

- [ ] Documentation (only if helpful)
  - [ ] Optionally add a short “Latency checks” bullet under `npm run test:ui` in `docs/setup.md` if maintainers need to know 2.2 adds a heavier looped test—skip if iteration time is negligible.

### Cross-story boundaries (non-goals)

- Story 2.3: responsive breakpoints, keyboard matrix, automated a11y suite for the whole page—do not fold that work into 2.2.
- Story 2.1: initial load and `GET` retry UX—leave as-is unless a shared string helper naturally applies.

## Dev Notes

Story 2.2 implements **FR-013** (failed mutation messaging) with explicit operation context and **NFR-002** (≤300ms visible UI update after successful mutation) with **measurement in UI integration tests** as specified in epics and PRD. [Source: docs/prd.md – FR-013, NFR-002] [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]

### Current code intelligence (`UPDATE` surfaces)

#### `src/pages/index.tsx`

- **Create errors:** `catch` sets `createError` to `error.message` or generic string—no **create** label or recovery line. `role="status"` already used. (AC 2 gap)
- **Toggle errors:** `toggleErrorById` stores raw message. (AC 2 gap)
- **Delete errors:** same. (AC 2 gap)
- **Success paths:** `setTodos` / `setDescription` after `await createTodo` / `updateTodoCompleted` / `deleteTodo`—no latency instrumentation today. (AC 1 gap)
- **Preserve:** validation path (`validateTodoDescription`) unchanged; loading/retry region from Story 2.1; pending flags per row; `fetchTodos` / `loadTodos` behavior.

#### `tests/home-page.ui.test.tsx`

- **Today:** Assertions like `expect(screen.getByText("Could not save todo."))` for create failure; analogous strings for toggle/delete. Will need updating once messages are prefixed/wrapped with guidance.

### Previous story intelligence (Story 2.1)

- List region uses `role="region"` and `aria-live="polite"`; mutation errors should remain inline `role="status"` and not steal focus.
- Mounted ref pattern applies to initial load only; mutations follow existing async handlers— avoid introducing regressions when adding timing wrappers.

### Architecture compliance

- Keep **immutable** state updates and **operation-scoped** pending/error flags. [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns]
- Typed API error envelope unchanged. [Source: docs/api.md]
- Mutation failure UX remains **non-blocking** with actionable tone. [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns – Error Handling Patterns]

### Git / stack (locked)

- Next `^15.2.3`, React `^19`, Vitest `^4.1.5`, Testing Library `@testing-library/react` `^16.x`—implement within repo versions.

### Statistical test caution

Flaky CI: if looped latency tests jitter near 300ms under load, prefer **deterministic mocks** (no `setTimeout` in mock paths unless required) and **sync or microtask** resolution so elapsed time stays well under budget. If flakes appear, tighten measurement window definition (same start/end semantics) rather than weakening the threshold (300ms / 95 of 100 are requirements).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: docs/prd.md – FR-013, NFR-002]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/implementation-artifacts/2-1-implement-initial-load-states-and-retryable-error-handling.md]

## Dev Agent Record

### Agent Model Used

(Story creation workflow)

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed — story targets mutation error wording gaps vs AC2 and latency/statistical assertions vs AC1 / NFR-002 tie-in.

### File List

- _bmad-output/implementation-artifacts/2-2-implement-mutation-error-feedback-and-latency-aware-ui-updates.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-04-30: Story created via `bmad-create-story`; `2-2` moved from backlog to ready-for-dev (Epic 2 already in-progress).
