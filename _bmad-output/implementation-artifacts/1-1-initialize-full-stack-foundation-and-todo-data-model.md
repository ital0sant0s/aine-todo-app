# Story 1.1: Initialize Full-Stack Foundation and Todo Data Model

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,  
I want a scaffolded full-stack project with todo schema and migration,  
so that todo features can be built on a durable and reproducible baseline.

## Acceptance Criteria

1. Given a new repository workspace, when the project is initialized using Create T3 App and baseline configuration is committed, then the app runs locally with documented setup commands and Prisma is configured with a PostgreSQL datasource and an initial Todo schema containing `id`, `description`, `completed`, and `createdAt`.
2. Given the initial Prisma schema, when migrations are created and applied, then the `todos` table exists with required constraints including description length and non-null rules, and `completed` defaults to `false`.

## Tasks / Subtasks

- [x] Initialize the project with Create T3 App (`npm create t3-app@latest aine-todo-app-v3`) using TypeScript and Tailwind.
- [x] Lock runtime/tooling baseline for local and container use (Node.js 22 LTS target).
- [x] Add Prisma and configure PostgreSQL datasource in `.env` and Prisma schema.
- [x] Define `Todo` model with required fields and constraints:
- [x] Map `description` to 1..200 chars after trim validation at API boundary (DB-level max length plus app validation).
- [x] Ensure `completed` defaults to `false`.
- [x] Generate and apply initial migration with Prisma Migrate.
- [x] Verify created table and columns in local Postgres.
- [x] Add/update setup docs with run and migration commands (`docs/setup.md`).

### Review Follow-ups (AI)

- [x] [AI-Review][High] Fix `db:generate` to run `prisma generate` instead of `prisma migrate dev` and align setup docs.
- [x] [AI-Review][Medium] Make `start-database.sh` idempotent by checking existing/running project container before generic port conflict checks.

## Dev Notes

- Use REST-first architecture and keep frontend-backend separation clean from the start. [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]
- Keep naming consistent:
- DB/table/column names: `snake_case` (table `todos`, column `created_at`).
- TypeScript symbols: camelCase/PascalCase.
- File names: kebab-case. [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- Keep this story scoped to foundation and data model only. Do not implement full CRUD UI/API behavior here.
- Follow PRD V1 scope boundaries (no auth, no multi-user, no reminders). [Source: docs/prd.md#Out of Scope (V1)]

### Project Structure Notes

- Expected structure alignment:
- Feature-first organization under `src/features/todos/*` for future stories.
- Shared utilities under `src/lib/*`.
- Prisma schema and migrations in the standard Prisma locations.
- This story establishes structure choices used by stories 1.2+; avoid ad-hoc placement that would force refactors later.

### Testing

- Add a minimal smoke check that project boots and DB connection/migration succeeds.
- Add a schema-level validation test or integration check proving `completed=false` default behavior.
- Keep test setup deterministic for future 100-run reliability target. [Source: docs/prd.md#Non-Functional Requirements]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Initialize Full-Stack Foundation and Todo Data Model]
- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: docs/prd.md#Todo Data Model]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Created via `bmad-create-story` after `bmad-sprint-planning` initialized sprint tracking.
- `npm install` completed successfully and Prisma client generated.
- `npx prisma migrate dev --name init_todo_model` created and applied migration.
- `npm run db:check:todo-default` passed (run with escalated networking to reach localhost DB).
- `npm run lint` and `npm run typecheck` passed.
- `npm run dev` could not bind to `0.0.0.0:3000` in this sandbox (`EPERM`), so runtime boot was validated by scaffold, lint/typecheck, and DB checks.

### Completion Notes List

- Scaffolded T3 app foundation in the existing repository with TypeScript, Tailwind, and Prisma boilerplate.
- Replaced default `Post` model with `Todo` model (`id`, `description`, `completed`, `createdAt`) and DB constraints.
- Updated environment configuration to use a dedicated local Postgres port (`5433`) for this project.
- Applied initial Prisma migration and generated client artifacts.
- Added an integration check script that verifies persisted default `completed=false`.
- Added `docs/setup.md` with install, database, migration, validation, and run commands.
- Story implementation completed and moved to `review`.
- Resolved review finding [High]: corrected `db:generate` to run `prisma generate` and updated docs wording.
- Resolved review finding [Medium]: reordered `start-database.sh` checks to return success when the project DB container is already running.

### File List

- _bmad-output/implementation-artifacts/1-1-initialize-full-stack-foundation-and-todo-data-model.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- .env
- .env.example
- .gitignore
- README.md
- eslint.config.js
- next-env.d.ts
- next.config.js
- package.json
- postcss.config.js
- prettier.config.js
- prisma/schema.prisma
- prisma/migrations/20260430014113_init_todo_model/migration.sql
- prisma/migrations/migration_lock.toml
- public/favicon.ico
- scripts/check-todo-default.mjs
- src/env.js
- src/pages/_app.tsx
- src/pages/index.tsx
- src/server/db.ts
- src/styles/globals.css
- start-database.sh
- tsconfig.json
- docs/setup.md

## Change Log

- 2026-04-30: Implemented Story 1.1 foundation, Prisma Todo schema, migration, DB integration check, and setup documentation.
- 2026-04-30: Addressed code review findings (2 resolved: 1 High, 1 Medium).

## Senior Developer Review (AI)

- Outcome: Changes Requested -> Addressed
- Review Date: 2026-04-30

### Action Items

- [x] [High] `db:generate` script changed to `prisma generate`; setup docs aligned.
- [x] [Medium] `start-database.sh` made idempotent for already-running project DB containers.
