# Story 1.4: Implement Complete and Delete Todo Interactions

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,  
I want to complete and remove todos,  
so that my list reflects current task status.

## Acceptance Criteria

1. Given an existing todo in the list, when I toggle its completion control, then the todo visual style updates to indicate completed or incomplete state, and the changed state persists after page refresh.
2. Given an existing todo in the list, when I activate delete on that item, then the todo is removed from the visible list, and it does not reappear after refresh.

## Tasks / Subtasks

- [x] Add toggle and delete controls to each todo row in `src/pages/index.tsx` with accessible labels and keyboard operability. (AC: 1, 2)
- [x] Add client helpers in `src/features/todos/client.js` for:
- [x] `PATCH /api/todos/:id` to update `completed`
- [x] `DELETE /api/todos/:id` to remove a todo
- [x] Wire UI handlers to call these helpers and update local list state immediately after successful responses while preserving newest-first order. (AC: 1, 2)
- [x] Render completed vs incomplete visual distinction (e.g., line-through + muted color) while keeping readability and contrast acceptable. (AC: 1)
- [x] Preserve existing create flow behavior and list/create validations from Story 1.3. (Regression)
- [x] Add/extend tests for:
- [x] successful toggle updates UI and persists after reload
- [x] successful delete removes item and persists after reload
- [x] failed toggle/delete surfaces non-blocking, user-readable error feedback
- [x] update docs if user-visible behavior or usage steps change.

### Review Findings

- [x] [Review][Patch] Sprint `last_updated` regressed chronologically versus the prior sprint-status value (implementations should bump this field forward whenever the sprint file is touched) [_bmad-output/implementation-artifacts/sprint-status.yaml] — resolved by setting `last_updated` to `2026-04-30T12:00:00Z` (after earlier `2026-04-30T03:00:00Z`).
- [x] [Review][Defer] Toggle/delete mutations do not use a mounted flag before `setState` after awaits; mirrors existing create flow pattern and rarely surfaces in SPA tests [src/pages/index.tsx] — deferred, pre-existing
- [x] [Review][Defer] Persistence is asserted via unmount/remount + fresh fetch mocks, not a literal browser reload; AC coverage is pragmatic but narrower than production navigation [tests/home-page.ui.test.tsx] — deferred, pre-existing

## Dev Notes

- Reuse existing API handlers and contracts already implemented in Story 1.2:
- `PATCH /api/todos/:id` expects `{ completed: boolean }` and returns `{ data: todo }`
- `DELETE /api/todos/:id` returns `{ data: { id } }`
- Keep error envelope unchanged: `{ error: { code, message, details? } }`. [Source: docs/api.md]
- Keep frontend-backend separation: page code should call client helpers only; no direct repository/DB usage in UI. [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries]
- Preserve create/list behavior from Story 1.3:
- initial loading/empty/error/list branches
- create validation and create error handling
- newest-first ordering by `createdAt` desc.

### Architecture Compliance

- Do not alter API response shapes or status semantics.
- Maintain naming conventions and file organization already in use (`src/pages`, `src/features/todos`, `tests`). [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- Keep UI state flags operation-scoped (toggle/delete pending and errors should not block unrelated actions). [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns]

### Current Code Intelligence (Files to Update)

- `src/pages/index.tsx`
- Current state:
- fetches todos on mount and renders loading/error/empty/list branches
- supports create flow with client-side validation and non-blocking create error
- todo rows currently render description + created timestamp only (no row actions).
- Story change:
- add per-item completion toggle control and delete control
- reflect completed visual state
- preserve existing create and load branches.
- Must preserve:
- existing list rendering, count label logic, and create flow behavior.

- `src/features/todos/client.js`
- Current state:
- exposes `fetchTodos`, `createTodo`, `validateTodoDescription`, `insertTodoNewestFirst`.
- Story change:
- add API helpers for patching completion and deleting by id.
- Must preserve:
- existing validation semantics and parseError behavior consistency.

- `tests/home-page.ui.test.tsx`
- Current state:
- covers initial fetch render, create success, client validation, create error.
- Story change:
- extend with toggle/delete success and error-path tests.
- Must preserve:
- existing passing assertions for Story 1.3 behavior.

### Previous Story Intelligence

- Story 1.3 completed and reviewed as `done`; it established the current page architecture and test setup.
- The page intentionally keeps non-blocking mutation error messaging; continue this pattern for toggle/delete.
- Keep test coverage style consistent with existing Vitest + Testing Library page-level tests.

### Git Intelligence Summary

- Recent commits show a strict lifecycle: create story -> implement -> review -> done.
- UI and story docs were updated together in prior stories; continue that workflow.
- Avoid broad refactors while implementing this story; prior commits focused on scoped changes per story.

### Latest Technical Information

- Use versions currently installed in this repository:
- Next `^15.2.3`
- React `^19.0.0`
- Prisma `^6.6.0`
- Vitest `^4.1.5`
- No upgrade is required for Story 1.4; implement within existing stack.

### Project Structure Notes

- The current repository uses the `src/pages` router and server modules under `src/server/*`; follow existing structure and avoid migration to `app/` router in this story.
- Story 1.4 belongs to Epic 1 scope only (toggle/delete interactions), while load-state refinement and broader UX reliability remain in Epic 2.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Implement Complete and Delete Todo Interactions]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 2: Complete/Delete a Todo]
- [Source: docs/api.md]
- [Source: _bmad-output/implementation-artifacts/1-3-build-todo-list-and-create-flow-in-the-ui.md]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Created via `bmad-create-story` from first `backlog` story in sprint-status.
- Source artifacts analyzed: epics, architecture, UX specification, Story 1.3, API contract, and recent commits.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story prepared for `dev-story` execution with explicit API, UI, and testing guardrails.
- Implemented checkbox + delete controls on each row with per-row pending and error flags; wired `updateTodoCompleted` / `deleteTodo` and `sortTodosNewestFirst` for list consistency after PATCH. Extended Vitest home page coverage for toggle/delete success, remount persistence, and error paths; added node tests for new client helpers. Updated `docs/setup.md` verification steps for complete/delete.

### File List

- src/features/todos/client.js
- src/pages/index.tsx
- tests/home-page.ui.test.tsx
- tests/todo-ui.test.js
- docs/setup.md
- _bmad-output/implementation-artifacts/1-4-implement-complete-and-delete-todo-interactions.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-04-29: Implemented Story 1.4 complete/delete UI and client helpers; tests and setup verification notes updated.
- 2026-04-29: Follow-up review: sprint `last_updated` corrected forward; Story 1.4 returned to `review` in sprint tracking.
