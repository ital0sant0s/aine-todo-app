# Story 1.2: Implement Todo CRUD API with Validation and Error Contract

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,  
I want stable API operations for todos,  
so that create/view/update/delete actions behave consistently and persist data.

## Acceptance Criteria

1. Given API routes for todo CRUD, when valid requests are sent to create, list, update completion, and delete todos, then the API returns successful HTTP status codes with consistent JSON success shape and mutations are persisted and visible in subsequent reads.
2. Given invalid or failing requests, when validation fails or a todo does not exist, then the API returns appropriate HTTP error status codes and errors follow a consistent JSON error envelope with code and message.

## Tasks / Subtasks

- [x] Add REST API endpoints for todos:
- [x] `POST /api/todos` (create)
- [x] `GET /api/todos` (list newest-first by `created_at`)
- [x] `PATCH /api/todos/:id` (toggle/update completion)
- [x] `DELETE /api/todos/:id` (delete)
- [x] Define and enforce request validation for:
- [x] `description` required, trimmed length 1..200
- [x] valid numeric `id` path parameter
- [x] valid boolean payload where applicable
- [x] Implement consistent JSON response envelope:
- [x] success: `{ "data": ... }`
- [x] failure: `{ "error": { "code": "...", "message": "...", "details": [...] } }`
- [x] Map core error types to HTTP statuses:
- [x] validation errors -> `400`
- [x] not found -> `404`
- [x] unexpected server failures -> `500`
- [x] Add automated tests for CRUD route behavior, persistence, and error contract.
- [x] Update documentation with endpoint contracts and examples.

## Dev Notes

- Use the Story 1.1 foundation as-is (Prisma `Todo` model and migration already in place); extend it without restructuring generated baseline paths unexpectedly. [Source: _bmad-output/implementation-artifacts/1-1-initialize-full-stack-foundation-and-todo-data-model.md]
- Keep API style RESTful JSON and enforce consistent envelope shapes and typed errors. [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Keep naming conventions:
- DB/table/column names: `snake_case`.
- API payload keys: `camelCase`.
- TS symbols: camelCase/PascalCase.
- Follow strict validation at the API boundary (trim and length checks included), even though DB has max length guardrails. [Source: docs/prd.md#Todo Data Model]
- Keep V1 scope strict: no auth, multi-user, reminders, or unrelated functionality. [Source: docs/prd.md#Out of Scope (V1)]

### Architecture Compliance

- Maintain frontend-backend separation and route-level contracts.
- Use Prisma repository/data-access patterns from current server layer and avoid leaking DB details directly to UI.
- Preserve deterministic ordering (`createdAt` descending) and clear API status semantics.

### Previous Story Intelligence

- Story 1.1 established:
- Create T3 app foundation with Prisma and Postgres.
- `Todo` model + migration in `prisma/schema.prisma` and `prisma/migrations/*`.
- `DATABASE_URL` currently configured for local container port `5433`.
- `start-database.sh` was adjusted for idempotent reruns.
- Reuse this exact baseline; do not replace DB tooling or scaffold structure.

### Testing

- Add/extend automated tests to cover:
- valid CRUD request success paths
- not-found behavior for update/delete
- validation failures (description constraints, malformed IDs/payloads)
- response envelope contract consistency across success and failure
- Ensure lint/typecheck/tests pass with no regressions.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Implement Todo CRUD API with Validation and Error Contract]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: docs/prd.md#Todo Operations]
- [Source: docs/prd.md#API and Persistence]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Created via `bmad-create-story` after Story 1.1 marked done.
- Implemented API handlers, validation, error mapping, and tests.
- Validation commands executed: `npm test`, `npm run lint`, `npm run typecheck`.

### Completion Notes List

- Comprehensive context generated for API CRUD, validation, and error contract implementation.
- Story status set to `ready-for-dev`.
- Implemented `POST/GET/PATCH/DELETE` todo API routes with deterministic list ordering and persistence semantics.
- Added strict API-boundary validation for body and path params, plus consistent success/error response envelopes.
- Added automated API behavior tests (CRUD, validation failures, not-found handling, and contract checks).
- Added endpoint contract documentation and examples in `docs/api.md`.
- Full validation passed: tests, lint, and typecheck.

### File List

- _bmad-output/implementation-artifacts/1-2-implement-todo-crud-api-with-validation-and-error-contract.md
- src/pages/api/todos/index.js
- src/pages/api/todos/[id].js
- src/server/api/envelope.js
- src/server/api/errors.js
- src/server/api/http.js
- src/server/todos/handlers.js
- src/server/todos/prisma-repository.js
- src/server/todos/serializer.js
- src/server/todos/validation.js
- tests/todos-api.test.js
- docs/api.md
- package.json

## Change Log

- 2026-04-30: Created Story 1.2 context file and prepared it for development.
- 2026-04-30: Implemented todo CRUD API, validation/error contract, automated tests, and API contract documentation; moved story to `review`.
