# Deferred work backlog

## Deferred from: code review (2026-04-29) — 1-4-implement-complete-and-delete-todo-interactions.md

- Toggle/delete mutation handlers omit an unmount guard unlike the initial-load effect; aligns with existing createTodo behavior. Revisit if React surfaces setState-after-unmount warnings during navigation-heavy flows.
- Home page tests approximate “persist after refresh” with component remount and sequential fetch mocks; consider a lightweight browser-level check later if regressions slip through RTL-only coverage.
