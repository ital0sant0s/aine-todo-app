# Story 2.3: Deliver Responsive and Accessible Main Todo Flow

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,
I want the todo app to work across devices and input methods,
so that I can use it effectively on mobile and desktop.

## Acceptance Criteria

1. Given viewport widths between 360px and 1440px, when I use the main todo flow at 360px, 768px, 1024px, and 1440px, then no horizontal scrollbar appears on the page, and create/toggle/delete controls remain visible, reachable, and operable at each viewport.
2. Given keyboard-only navigation, when I tab through create, toggle, and delete controls, then all interactive elements are reachable and operable, and controls expose accessible labels and visible focus indicators, and automated accessibility checks report zero critical violations for the main todo flow pages.

## Tasks / Subtasks

- [x] Enforce responsive layout constraints across the full page shell and todo panels (AC: 1)
- [x] Verify and harden interactive control behavior at 360/768/1024/1440 viewport widths for create/toggle/delete flows (AC: 1)
- [x] Ensure keyboard-only traversal and operation for all main flow controls (input, add button, per-row checkbox, per-row delete) (AC: 2)
- [x] Preserve and, where needed, improve accessible labels and visible focus indicators on all interactive elements (AC: 2)
- [x] Add automated accessibility checks for the main todo flow with zero critical violations as gate criteria (AC: 2)
- [x] Add or extend UI integration tests to validate viewport behavior and keyboard operability assertions (AC: 1, 2)
- [x] Keep Story 2.1 and 2.2 behaviors intact (initial load/retry, mutation error messaging, latency-aware update expectations) (Regression)

## Dev Notes

Story 2.3 implements FR-014 and NFR-005 for the existing todo flow. Scope is the current home page experience, not a redesign. Preserve established UX intent: explicit state communication, calm clarity, and non-blocking error recovery while improving device/input accessibility quality. [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3] [Source: _bmad-output/planning-artifacts/ux-design-specification.md]

### Previous story intelligence (2.2)

- Mutation failures now include operation-context copy and recovery guidance; do not regress these messages or blocking behavior.
- The page already uses per-operation pending/error state maps and immutable updates; preserve this state model.
- Existing integration tests in `tests/home-page.ui.test.tsx` already exercise create/toggle/delete paths and should be extended rather than fragmented.
- 2.2 added heavier mutation latency loops; keep new 2.3 tests deterministic and avoid introducing flaky timing behavior.

### Current code intelligence (`UPDATE` surfaces)

#### `src/pages/index.tsx`

- Main flow controls and labels already exist:
  - Create input: `label` + `id="todo-input"`, validation linkage via `aria-describedby`.
  - Add button: explicit text and disabled pending state.
  - Toggle checkbox: per-row `aria-label` (`Mark complete/incomplete: {description}`).
  - Delete button: per-row `aria-label` (`Delete todo: {description}`).
- Focus styling currently uses `focus-visible` ring/outline classes on key controls; maintain visible focus indicators while adjusting layout.
- Layout is currently single-column and Tailwind-driven; verify no overflow at 360px after long text and action controls.
- Error/status nodes use `role="status"`; keep polite, non-blocking status messaging semantics.

#### `src/styles/globals.css`

- Theme currently only defines font tokens and relies on Tailwind utility classes.
- If additional global overflow/focus helpers are introduced, keep them minimal and avoid broad resets that could regress existing components.

#### `tests/home-page.ui.test.tsx`

- Existing suite is the best location for 2.3 coverage expansion.
- Add targeted tests for keyboard navigation/activation and accessibility assertions without breaking current behavior tests.
- Ensure new assertions remain stable in JSDOM and avoid brittle style-dependent checks where semantic checks are possible.

### Architecture compliance guardrails

- Maintain feature-local UI state and immutable updates; no global store introduction for this story. [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Keep API contract and client error parsing semantics unchanged; this story is UI behavior and accessibility hardening. [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Follow naming/structure conventions and avoid moving logic into ad hoc locations. [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- Preserve process patterns: explicit app states, non-blocking failures, and operation-scoped pending flags. [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns]

### Library/framework requirements

Use repository-locked stack versions for this story:
- Next.js `^15.2.3`
- React `^19.0.0`
- Tailwind CSS `^4.0.15`
- Vitest `^4.1.5`
- Testing Library React `^16.3.2`

Do not introduce additional UI frameworks or alternate state libraries for Story 2.3 unless required by an explicit blocker.

### File structure requirements

Primary expected touch points:
- `src/pages/index.tsx`
- `tests/home-page.ui.test.tsx`
- `src/styles/globals.css` (only if minimal global support is required)

Optional documentation updates only if behavior/testing workflow meaningfully changes:
- `docs/testing.md`
- `docs/setup.md`

### Testing requirements

- Extend automated UI tests to cover 360/768/1024/1440 responsive expectations relevant in test environment (no horizontal overflow proxy checks where feasible, and control presence/operability assertions).
- Add keyboard navigation/activation tests for create/toggle/delete.
- Add automated accessibility checks with zero critical violations for the main flow pages.
- Keep existing 2.1/2.2 tests passing without modifying acceptance behavior.

### Project Structure Notes

- Current implementation aligns to a focused page-level todo flow. Story 2.3 should continue incremental hardening in-place.
- No architecture/document evidence requires moving to a different route or component architecture for this story.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns]
- [Source: _bmad-output/implementation-artifacts/2-2-implement-mutation-error-feedback-and-latency-aware-ui-updates.md]

## Dev Agent Record

### Agent Model Used

Developer story workflow (implementation)

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story scope explicitly bounded to responsive/accessibility hardening for the existing main flow.
- Guardrails added to prevent regressions to Story 2.1 and Story 2.2 behavior.
- Implemented `overflow-x` clipping on `html`/`body` and `main`, `min-w-0` flex discipline, long-text `break-words`, full-width delete on narrow viewports, and visible focus styles on the Add button.
- Extended `tests/home-page.ui.test.tsx` with viewport-width checks (360–1440), jest-axe critical-violation gates (loading, empty, error+retry, list), and keyboard-only create/toggle/delete via `@testing-library/user-event`.
- Added dev dependencies: `jest-axe`, `@testing-library/user-event`, `@types/jest-axe`.
- Full suite: `npm run check`, `npm run test:ui`, `npm test` all pass.

### File List

- src/pages/index.tsx
- src/styles/globals.css
- tests/home-page.ui.test.tsx
- package.json
- package-lock.json
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/2-3-deliver-responsive-and-accessible-main-todo-flow.md

### Change Log

- Story 2.3: responsive overflow constraints, focus and label hardening, axe + keyboard + viewport UI tests, ready for review (2026-04-30).
- Code review (2026-04-30): patch applied for monotonic `last_updated` in `sprint-status.yaml`; story marked done.

### Review Findings

- [x] [Review][Patch] Sprint `last_updated` timestamp moved backward versus the prior value — `_bmad-output/implementation-artifacts/sprint-status.yaml`
- [x] [Review][Defer] Viewport overflow regression guard relies on JSDOM `scrollWidth`/`clientWidth` and mocked widths; spot-check real browsers at 360/768/1024/1440 for AC1 — deferred, test-environment limitation
- [x] [Review][Defer] `jest-axe` + `@types/jest-axe` expanded the devDependency graph (extra Jest 30–family packages); monitor supply-chain/upgrade noise — deferred, test-only tooling
