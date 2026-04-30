# Deferred work backlog

## Deferred from: code review (2026-04-29) — 1-4-implement-complete-and-delete-todo-interactions.md

- Toggle/delete mutation handlers omit an unmount guard unlike the initial-load effect; aligns with existing createTodo behavior. Revisit if React surfaces setState-after-unmount warnings during navigation-heavy flows.
- Home page tests approximate “persist after refresh” with component remount and sequential fetch mocks; consider a lightweight browser-level check later if regressions slip through RTL-only coverage.

## Deferred from: code review of 2-3-deliver-responsive-and-accessible-main-todo-flow.md (2026-04-30)

- Viewport overflow regression guard relies on JSDOM `scrollWidth`/`clientWidth` and mocked widths; spot-check real browsers at 360/768/1024/1440 for AC1 (test-environment limitation).
- `jest-axe` + `@types/jest-axe` expanded the devDependency graph (extra Jest 30–family packages); monitor supply-chain/upgrade noise (test-only tooling).
