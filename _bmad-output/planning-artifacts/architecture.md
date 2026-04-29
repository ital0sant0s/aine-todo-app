---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - /Users/italosantos/projects/nearform/ogcio/aine-todo-app-v3/docs/prd.md
workflowType: 'architecture'
project_name: 'aine-todo-app-v3'
user_name: 'Italosantos'
date: '2026-04-29'
lastStep: 8
status: 'complete'
completedAt: '2026-04-29'
---


# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product scope focuses on a tight todo CRUD loop for a single user context: create todos with validated descriptions, list all todos newest-first, toggle completion, and delete records. Architecturally this implies a stable resource model, deterministic sorting behavior, and predictable mutation semantics. UI state management must support first-load branching (loading/empty/error/list) and maintain usability when operations fail. Persistence is mandatory across refresh, requiring durable storage and consistent read-after-write behavior.

**Non-Functional Requirements:**
Key architectural drivers are:
- Performance: initial render within 2 seconds for up to 200 todos.
- Interaction latency: visible UI updates within 300ms after successful API responses.
- Reliability: >=99% pass rate over repeated automated API test runs.
- Maintainability: lint compliance and automated coverage for critical CRUD paths.
- Accessibility: keyboard-operable controls with accessible labels.
These requirements push toward simple, observable API boundaries, efficient query/update paths, and a testing strategy that validates both correctness and runtime behavior.

**Scale & Complexity:**
This is an MVP with constrained domain complexity and limited feature breadth, but with clear quality bars that require disciplined architecture.

- Primary domain: full-stack web CRUD application
- Complexity level: low-to-medium
- Estimated architectural components: 5-7 (UI app shell, todo feature module, API layer, domain/service layer, repository/data access, persistence store, test/support infrastructure)

### Technical Constraints & Dependencies

- Enforce frontend-backend separation with documented API contracts.
- Persist todo state in a durable store suitable for local reproducibility.
- Keep V1 architecture isolated from out-of-scope expansions (auth, multi-user, reminders, collaboration).
- Support responsive usage from 360px to 1440px.
- Provide containerized local environment (`Dockerfile`, `.dockerignore`, `docker-compose.yml` as needed).
- Maintain documentation outputs for setup, architecture, testing, and deployment.

### Cross-Cutting Concerns Identified

- Input validation and normalization (`description` trim/length rules)
- Error handling and user-safe failure messaging across all mutations
- Consistent API status-code and error-shape conventions
- Deterministic ordering and state consistency after write operations
- Accessibility semantics for interactive controls and status messaging
- Test data lifecycle management for reliable automated runs
- Performance measurement hooks for NFR verification

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application based on project requirements analysis.

### Starter Options Considered

- Next.js (`create-next-app`): production-ready React full-stack baseline, App Router, API capability, TypeScript-first defaults.
- Vite (`create vite`): excellent frontend scaffolding; backend and persistence architecture must be added separately.
- Create T3 App (`create-t3-app`): modular full-stack Next.js scaffolding with optional tRPC/Prisma/Drizzle/NextAuth modules.

### Selected Starter: Create T3 App

**Rationale for Selection:**
Create T3 App best matches the PRD's need for a clean full-stack foundation with durable persistence and maintainable testing paths, while keeping modules optional so MVP scope stays controlled.

**Initialization Command:**

```bash
npm create t3-app@latest aine-todo-app-v3
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-first Node.js/Next.js setup with modern full-stack conventions.

**Styling Solution:**
Tailwind CSS available as a standard optional selection in scaffold flow.

**Build Tooling:**
Next.js integrated build/runtime tooling with production-oriented defaults.

**Testing Framework:**
Baseline app scaffolding; test framework choices can be added explicitly in architecture decisions and implementation stories.

**Code Organization:**
Convention-based full-stack structure aligned to Next.js app architecture, suitable for feature/module boundaries.

**Development Experience:**
Interactive scaffolding with optional modules (`--default`, `--noInstall`, `--CI` flags available), enabling controlled MVP setup.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database: PostgreSQL for durable local+container reproducibility.
- ORM and migrations: Prisma ORM v7 line, Prisma Migrate as source of schema truth.
- API style: RESTful JSON endpoints with explicit error envelope.
- Validation strategy: shared schema validation at API boundary plus UI input pre-validation.
- Runtime baseline: Node.js 22 LTS target for app and tooling consistency.

**Important Decisions (Shape Architecture):**
- Frontend data layer: server-first rendering for initial list + client mutation actions with optimistic UI where safe.
- State approach: feature-local UI state + server state via fetch layer (no global state library for MVP).
- Observability: structured request/error logging and lightweight performance instrumentation for NFR checks.
- Test architecture: unit + API integration + E2E with deterministic test data reset.

**Deferred Decisions (Post-MVP):**
- Authentication/authorization framework (explicitly out of scope in PRD).
- Distributed caching/queueing.
- Horizontal scaling and multi-region strategies.

### Data Architecture

- **Database choice:** PostgreSQL (single primary for MVP).
- **ORM:** Prisma ORM (v7 series).
- **Modeling approach:** Single `Todo` aggregate with fields `id`, `description`, `completed`, `createdAt`; strict constraints on description length/trimmed content.
- **Migration approach:** Prisma Migrate checked into repo; migrations applied in CI and startup workflows.
- **Caching strategy:** No external cache in MVP; rely on DB + app-level request efficiency.

### Authentication & Security

- **Authentication:** None in MVP (per PRD scope).
- **Authorization:** Not applicable for V1 single-user context.
- **API security baseline:** input validation, consistent error handling, secure HTTP headers, CORS restricted to app origin(s), environment-secret hygiene.
- **Encryption:** TLS in deployed environments; no special field-level encryption required for current todo data class.

### API & Communication Patterns

- **Pattern:** REST endpoints for todo CRUD.
- **Contract style:** JSON request/response with consistent success/error shapes.
- **Error standard:** typed error codes mapped to HTTP statuses (validation, not found, conflict, server error).
- **Documentation:** OpenAPI-style endpoint contract doc in `docs/architecture.md` and companion testing examples.
- **Rate limiting:** minimal protective middleware (basic burst limit) at edge/app layer, tunable later.

### Frontend Architecture

- **Rendering/data fetch:** initial todo list fetched on load path with explicit loading/empty/error branches.
- **State management:** local component state + server synchronization via API calls; avoid heavyweight global store for MVP.
- **Component architecture:** feature-oriented slices (`todo-list`, `todo-item`, `todo-form`, `ui-state-panels`).
- **Performance optimization:** minimize rerenders on toggle/delete; keep list operations stable for up to 200 items.
- **Accessibility:** keyboard-operable controls, semantic labels, visible focus states, and status messaging.

### Infrastructure & Deployment

- **Hosting strategy:** container-first deployment path.
- **Local orchestration:** `docker-compose` for app + PostgreSQL in reproducible dev/test.
- **Environment configuration:** `.env` contracts with validated required variables at startup.
- **CI/CD baseline:** lint, unit tests, API integration tests, E2E smoke, migration check.
- **Monitoring/logging:** structured app logs and test-time performance assertions aligned to PRD NFRs.

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold project and lock runtime/tooling versions.
2. Define Prisma schema + initial migration.
3. Implement REST API contract + validation/error envelope.
4. Build UI flows (create/list/toggle/delete + state branches).
5. Add automated tests across unit/integration/E2E.
6. Add Docker and CI pipeline validations.

**Cross-Component Dependencies:**
- Validation rules drive both API handlers and UI feedback behavior.
- Migration/schema decisions govern API payload and test fixtures.
- Error contract consistency affects frontend state rendering and E2E assertions.
- Container/env decisions affect local reliability and CI reproducibility.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 major areas where AI agents could diverge: naming, structure, format, communication, and process behavior.

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case` plural (`todos`)
- Columns: `snake_case` (`created_at`, `is_completed`)
- Primary keys: `id`
- Foreign keys: `<entity>_id`
- Indexes/constraints: `idx_<table>_<column>`, `uq_<table>_<column>`

**API Naming Conventions:**
- Resource paths: plural nouns (`/api/todos`)
- Path params: `/api/todos/:id`
- Query params: `camelCase` at API boundary (`createdAfter`, `pageSize`)
- Headers: standard HTTP casing; custom headers prefixed `x-`

**Code Naming Conventions:**
- TS/JS variables/functions: `camelCase`
- React components/types/classes: `PascalCase`
- File names: kebab-case for modules (`todo-item.tsx`, `todo-service.ts`)
- Constants/env keys: `UPPER_SNAKE_CASE`

### Structure Patterns

**Project Organization:**
- Feature-first organization under `src/features/todos/*`
- Shared utilities under `src/lib/*`
- API route handlers grouped by resource path
- Data access isolated in repository/service layer, not UI components

**File Structure Patterns:**
- Tests co-located for unit (`*.test.ts[x]`) and separate E2E folder for flows
- Validation schemas near API/domain boundaries
- Docs maintained under `docs/` by concern (`setup`, `testing`, `deployment`, `architecture`)

### Format Patterns

**API Response Formats:**
- Success:
  - List/get: `{ "data": ... }`
  - Mutations: `{ "data": ..., "meta": { ... } }` when relevant
- Error:
  - `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`
- No mixed ad-hoc response shapes per endpoint

**Data Exchange Formats:**
- JSON fields: `camelCase` in API payloads
- Internal DB schema: `snake_case` mapped via ORM
- Datetimes: ISO-8601 UTC strings in API (`2026-04-29T12:34:56.000Z`)
- Booleans: native `true/false` only

### Communication Patterns

**Event/System Patterns (within app):**
- Domain action naming: `<entity>.<action>` (e.g., `todo.created`)
- Log fields include: `event`, `entityId`, `requestId` when available
- Mutation side-effects centralized in service/use-case layer

**State Management Patterns:**
- Server state and UI state separated explicitly
- No direct mutation of state objects; immutable updates only
- Loading/error flags scoped by operation (`isCreating`, `isToggling`, `isDeleting`)
- Optimistic updates only for toggle/delete with rollback on failure

### Process Patterns

**Error Handling Patterns:**
- Validate inputs before repository calls
- Map domain/infrastructure errors to typed API errors consistently
- User-facing errors are actionable and non-technical
- Internal errors logged with structured context, not exposed raw

**Loading State Patterns:**
- Initial load uses explicit `loading | empty | error | ready` branch
- Mutations show per-item or per-action pending state
- Retry affordance required for initial load failure and failed mutations

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming/format rules exactly for new files, APIs, and schema changes
- Reuse shared error and response helpers instead of custom endpoint shapes
- Add/update tests with each behavior change (unit/integration/E2E as appropriate)

**Pattern Enforcement:**
- Lint + typecheck + test gates in CI
- PR review checklist includes naming/format/process compliance
- Pattern violations documented in architecture notes and fixed before merge

### Pattern Examples

**Good Examples:**
- `GET /api/todos` -> `{ "data": [{ "id": "...", "description": "...", "completed": false, "createdAt": "..." }] }`
- Error -> `{ "error": { "code": "VALIDATION_ERROR", "message": "Description is required", "details": ["description"] } }`
- File names: `todo-list.tsx`, `todo-repository.ts`, `create-todo.test.ts`

**Anti-Patterns:**
- Mixing `snake_case` and `camelCase` in API payloads
- Endpoint-specific custom error structures
- Business logic directly inside React components
- Global loading flag that blocks unrelated actions

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
aine-todo-app-v3/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.js
├── prettier.config.cjs
├── postcss.config.js
├── .env.example
├── .env.local
├── .gitignore
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── assets/
├── docs/
│   ├── setup.md
│   ├── architecture.md
│   ├── testing.md
│   └── deployment.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       └── todos/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   ├── features/
│   │   └── todos/
│   │       ├── components/
│   │       │   ├── todo-form.tsx
│   │       │   ├── todo-list.tsx
│   │       │   ├── todo-item.tsx
│   │       │   └── todo-state-panel.tsx
│   │       ├── hooks/
│   │       │   └── use-todos.ts
│   │       ├── schemas/
│   │       │   └── todo.schema.ts
│   │       ├── services/
│   │       │   └── todo-api-client.ts
│   │       └── types/
│   │           └── todo.ts
│   ├── server/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   └── todo-repository.ts
│   │   ├── services/
│   │   │   └── todo-service.ts
│   │   ├── validation/
│   │   │   └── todo-validation.ts
│   │   └── api/
│   │       ├── response.ts
│   │       └── errors.ts
│   ├── lib/
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   └── middleware.ts
├── tests/
│   ├── integration/
│   │   └── api/
│   │       └── todos.test.ts
│   ├── e2e/
│   │   └── todos-flow.spec.ts
│   └── fixtures/
│       └── todo-fixtures.ts
└── scripts/
    ├── db-reset.ts
    └── check-performance.ts
```

### Architectural Boundaries

**API Boundaries:**
- External boundary: `src/app/api/todos/**` only.
- API handlers delegate to server services; no direct DB access in route handlers.
- Response format enforced through `src/server/api/response.ts` and `src/server/api/errors.ts`.

**Component Boundaries:**
- UI components live under `src/features/todos/components`.
- Components call feature hooks/services, not DB/repository modules.
- Shared generic utilities stay in `src/lib`, feature-specific logic stays in feature folders.

**Service Boundaries:**
- Domain orchestration in `src/server/services/todo-service.ts`.
- Persistence only through `src/server/db/todo-repository.ts`.
- Validation at API boundary and service preconditions.

**Data Boundaries:**
- Prisma schema/migrations are sole schema source (`prisma/*`).
- DB model uses snake_case mappings; API contracts expose camelCase.
- No frontend direct coupling to Prisma types.

### Requirements to Structure Mapping

**Feature Mapping (Todo CRUD + states):**
- Create/View/Toggle/Delete UI: `src/features/todos/components/*`
- Client-side flow/state: `src/features/todos/hooks/use-todos.ts`
- API routes: `src/app/api/todos/route.ts`, `src/app/api/todos/[id]/route.ts`
- Domain/service logic: `src/server/services/todo-service.ts`
- Persistence: `src/server/db/todo-repository.ts`, `prisma/schema.prisma`
- Automated tests: `tests/integration/api/todos.test.ts`, `tests/e2e/todos-flow.spec.ts`

**Cross-Cutting Concerns:**
- Validation: `src/features/todos/schemas/todo.schema.ts`, `src/server/validation/todo-validation.ts`
- Error contract: `src/server/api/errors.ts`
- Logging/observability: `src/lib/logger.ts`
- Environment config: `src/lib/env.ts`, `.env.example`

### Integration Points

**Internal Communication:**
- UI -> feature hook -> API client -> `/api/todos` endpoints.
- API route -> service -> repository -> Prisma client.

**External Integrations:**
- PostgreSQL via Prisma client.
- CI provider via `.github/workflows/ci.yml`.
- Container runtime via Docker/Docker Compose.

**Data Flow:**
1. User action triggers feature hook.
2. Hook calls API endpoint.
3. API validates and dispatches to service.
4. Service applies rules and repository persistence.
5. Response helper formats output.
6. UI updates local/server state view.

### File Organization Patterns

**Configuration Files:**
- Root-level runtime/tooling config.
- Environment contracts in `.env.example` and validated in `src/lib/env.ts`.

**Source Organization:**
- Feature-first for frontend, layered server modules for backend concerns.
- Strict separation of UI, domain logic, and persistence.

**Test Organization:**
- Integration tests for API contracts.
- E2E tests for user journeys.
- Reusable fixtures under `tests/fixtures`.

**Asset Organization:**
- Static assets under `public/assets`.
- No business logic in asset or public directories.

### Development Workflow Integration

**Development Server Structure:**
- Single Next.js runtime with API routes and UI.
- Local DB provisioned through `docker-compose.yml`.

**Build Process Structure:**
- Next.js build consumes `src/app` and shared modules.
- Prisma migration/generation part of setup and CI validation.

**Deployment Structure:**
- Container-first packaging with environment-driven configuration.
- Same structure supports local, CI, and target deployment runtime.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selected stack (Next.js-based full-stack app, TypeScript, Prisma, PostgreSQL, Docker) is internally compatible. Architectural layers (UI -> API route -> service -> repository -> DB) are consistent with selected technologies and conventions.

**Pattern Consistency:**
Naming, format, and process patterns align with architectural decisions. API format standards, validation placement, and error-handling rules are consistent across frontend/backend boundaries.

**Structure Alignment:**
The proposed project tree supports all decision categories and clearly enforces UI/domain/persistence boundaries. No structural contradiction found.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
No epics document was provided; FR/AC-driven mapping is complete for MVP todo flows.

**Functional Requirements Coverage:**
All core requirements (create/view/toggle/delete, persistence, list order, loading/empty/error states, API status handling) map to explicit modules/routes/services/tests.

**Non-Functional Requirements Coverage:**
Performance, reliability, maintainability, accessibility, and reproducible containerized setup are all represented in architecture decisions and structure.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical and important decisions are documented, including concrete runtime/data/API/pattern directions.

**Structure Completeness:**
Directory and file layout is concrete and implementation-oriented, including CI, docs, tests, and infrastructure paths.

**Pattern Completeness:**
Conflict-prone areas (naming, response shape, error contract, state/loading behavior) are explicitly standardized.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps (non-blocking):**
- Explicit testing tool selection (e.g., Vitest/Jest, Playwright/Cypress) is implied but not locked as a named choice.
- Rate-limiting strategy is defined at baseline level but exact middleware/threshold is deferred.

**Nice-to-Have Gaps:**
- Add sample OpenAPI artifact or endpoint contract table to docs.
- Add example CI matrix for Node and DB service health checks.

### Validation Issues Addressed

No blocking architectural conflicts identified. Deferred items are intentionally non-MVP or tuning-level details and do not prevent implementation kickoff.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** high

**Key Strengths:**
- Clear separation of concerns across UI, API, service, and persistence layers.
- Strong consistency rules for multi-agent implementation.
- Requirements-to-structure traceability for MVP scope.
- Containerized and test-oriented delivery posture from the start.

**Areas for Future Enhancement:**
- Lock explicit test runner/E2E framework names.
- Formalize rate-limit and observability thresholds post-MVP stabilization.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
`npm create t3-app@latest aine-todo-app-v3`
