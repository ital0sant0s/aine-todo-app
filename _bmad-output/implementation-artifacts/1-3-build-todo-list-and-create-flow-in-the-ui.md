# Story 1.3: Build Todo List and Create Flow in the UI

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,  
I want to add todos and immediately see them in my list,  
so that I can quickly manage tasks.

## Acceptance Criteria

1. Given the app is loaded with an available backend, when I submit a valid todo description, then a new todo appears in the list in newest-first order, and the input is cleared after successful creation.
2. Given I submit empty, whitespace-only, or over-limit text, when client-side validation runs, then the todo is not created, and clear validation feedback is shown.

## Tasks / Subtasks

- [x] Replace the starter home page with a todo UI shell wired to the existing REST API.
- [x] Implement initial todo list fetch (`GET /api/todos`) on page load and render current todos newest-first.
- [x] Implement todo create form using the existing API contract (`POST /api/todos`) and trim input before submit.
- [x] Add client-side validation for description rules:
- [x] required after trim
- [x] max length 200 after trim
- [x] block submit and show inline, user-readable validation feedback when invalid
- [x] On successful create:
- [x] clear input
- [x] update list immediately while preserving newest-first order
- [x] Add non-blocking mutation error feedback for failed create requests.
- [x] Add/extend tests for list rendering + create flow + validation feedback.
- [x] Update docs if any frontend behavior assumptions or usage guidance change.

## Dev Notes

- Reuse existing API endpoints and response envelope exactly as implemented in Story 1.2. Do not introduce new API shapes for this story. [Source: docs/api.md]
- Keep Story 1.3 scope focused on list + create flow only; do not implement toggle/delete interactions in this story (reserved for Story 1.4). [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Implement Complete and Delete Todo Interactions]
- Preserve list ordering rule from PRD/API: newest first by `createdAt` descending.
- Keep V1 scope boundaries unchanged: no auth, no multi-user, no reminders. [Source: docs/prd.md#Out of Scope (V1)]

### Architecture Compliance

- Keep frontend-backend separation; page/UI components call API routes, not DB/repository modules directly. [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries]
- Follow naming and format conventions already used in the codebase:
- API payload keys in `camelCase`
- response envelopes: success `{ "data": ... }`, error `{ "error": { ... } }`
- Respect project structure already established (Next.js pages router in current codebase; avoid broad structural refactors in this story). [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]

### Current Code Intelligence (Files Likely Updated)

- `src/pages/index.tsx` currently contains default Create T3 starter content and should be replaced with the todo list + create UI.
- `src/styles/globals.css` currently has minimal theme tokens; extend only as needed for readable, accessible todo UI.
- Existing server/API modules and contracts from Story 1.2 should be consumed as-is; do not rewrite backend handlers for this story.

### Previous Story Intelligence

- Story 1.2 already delivered:
- `GET /api/todos` (newest-first list)
- `POST /api/todos` with trim + 1..200 validation and consistent error envelopes
- API tests and docs contract in `docs/api.md`
- Build on this behavior instead of duplicating validation logic inconsistently between frontend and backend.

### Testing

- Add/extend tests to cover:
- initial list render from API data
- successful create flow (submit -> item appears at top -> input cleared)
- client-side validation for empty/whitespace/over-limit input (no API mutation when invalid)
- failed create request feedback remains non-blocking and user-readable
- Keep regression safety for Story 1.2 API behavior.

### Latest Technical Information

- Use the currently installed stack and patterns in this repo (Next 15, React 19, Tailwind 4, Prisma 6) unless a separate story explicitly requests upgrades. [Source: package.json]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Build Todo List and Create Flow in the UI]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 1: Create a Todo]
- [Source: docs/api.md]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Created via `bmad-create-story` from first `backlog` story in sprint-status.
- Source artifacts analyzed: epics, architecture, UX specification, Story 1.2, and recent commits.
- Implemented UI list/create flow in `src/pages/index.tsx` with API consumption from shared client helpers.
- Added frontend behavior tests in `tests/todo-ui.test.js`.
- Validation run: `npm test`, `npm run lint`, `npm run typecheck` (all passing).

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story prepared for `dev-story` execution with explicit scope guardrails and test expectations.
- Replaced starter page UI with todo list + create flow and accessible state messaging.
- Added initial load fetch for `GET /api/todos` with loading, empty, and error display handling.
- Implemented create flow for `POST /api/todos` with client-side validation for required/trimmed/max-length constraints.
- Ensured successful creation clears input and updates list in newest-first order.
- Added non-blocking create failure feedback.
- Added automated UI helper tests and retained Story 1.2 API regression coverage.
- Updated setup documentation with manual verification steps for the UI flow.
- Added page-level UI tests with Vitest + Testing Library to validate Story 1.3 acceptance flows directly in the rendered page.

### File List

- _bmad-output/implementation-artifacts/1-3-build-todo-list-and-create-flow-in-the-ui.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- package.json
- package-lock.json
- src/pages/index.tsx
- src/features/todos/client.js
- vitest.config.ts
- tests/todo-ui.test.js
- tests/home-page.ui.test.tsx
- tests/vitest.setup.ts
- docs/setup.md

## Change Log

- 2026-04-30: Created Story 1.3 context file and marked it ready for development.
- 2026-04-30: Implemented todo list and create UI flow with validation, tests, and setup documentation updates; moved story to `review`.
- 2026-04-30: Code review passed and story status moved to `done`.
