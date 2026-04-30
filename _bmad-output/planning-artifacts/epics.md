---
stepsCompleted: [1,2,3]
inputDocuments:
  - /Users/italosantos/projects/nearform/ogcio/aine-todo-app-v3/docs/prd.md
  - /Users/italosantos/projects/nearform/ogcio/aine-todo-app-v3/_bmad-output/planning-artifacts/architecture.md
---

# aine-todo-app-v3 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for aine-todo-app-v3, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-001: The system shall store each todo with fields: `id`, `description`, `completed`, `createdAt`.
FR-002: `description` shall be required and contain 1 to 200 characters after trimming whitespace.
FR-003: `completed` shall default to `false` on creation.
FR-004: The user can create a todo by submitting valid text.
FR-005: The user can view all todos in a list sorted by `createdAt` descending (newest first).
FR-006: The user can toggle a todo between complete and incomplete.
FR-007: The user can delete a todo.
FR-008: The backend shall provide CRUD API endpoints for todos.
FR-009: Successful create/update/delete operations shall be persisted and reflected after page refresh.
FR-010: The API shall return appropriate HTTP status codes for success and failure cases.
FR-011: On first load, the app shall request todos and render one of: loading, empty, error, or list state.
FR-012: Completed todos shall have a visual style distinct from incomplete todos.
FR-013: On failed create/update/delete operations, the UI shall display a user-readable error message.
FR-014: The UI shall be usable at viewport widths from 360px to 1440px.

### NonFunctional Requirements

NFR-001: For list views up to 200 todos, initial data render shall complete within 2 seconds on a standard broadband connection.
NFR-002: After successful API response, UI state update for create/toggle/delete shall be visible within 300ms.
NFR-003: In a 100-run local automated API test suite, CRUD endpoints shall pass at least 99% of runs.
NFR-004: Code shall pass configured lint checks and have automated tests for critical CRUD flows.
NFR-005: All interactive controls in main todo flow shall be keyboard operable and have accessible labels.

### Additional Requirements

- Starter template requirement: initialize with Create T3 App (`npm create t3-app@latest aine-todo-app-v3`) as the first implementation story.
- Database and persistence requirement: use PostgreSQL with Prisma ORM and Prisma Migrate for durable, reproducible storage.
- API contract requirement: implement RESTful JSON CRUD endpoints with consistent success/error envelopes and typed error-to-status mapping.
- Validation requirement: enforce shared validation for todo description constraints at API boundary and UI pre-validation.
- Infrastructure requirement: provide container-first local orchestration using Docker (`Dockerfile`, `.dockerignore`, `docker-compose`) for reproducible dev/test.
- Configuration requirement: define and validate required `.env` contract at startup.
- Test architecture requirement: implement unit, API integration, and E2E test coverage with deterministic data setup/reset.
- Observability requirement: structured logging and lightweight performance instrumentation to verify NFRs.
- Accessibility requirement: keyboard-operable controls, accessible labels, visible focus states, and status messaging.
- Documentation requirement: maintain `docs/setup.md`, `docs/architecture.md`, `docs/testing.md`, and `docs/deployment.md`.

### UX Design Requirements

UX design specification is included and is the source-of-truth for UX intent:
- `/Users/italosantos/projects/nearform/ogcio/aine-todo-app-v3/_bmad-output/planning-artifacts/ux-design-specification.md`
Key aligned UX expectations include explicit loading/empty/error/list states, responsive usability from 360px to 1440px, non-blocking error recovery, and keyboard-accessible controls.

### FR Coverage Map

FR-001: Epic 1 - Todo entity fields
FR-002: Epic 1 - Description validation constraints
FR-003: Epic 1 - Default incomplete state
FR-004: Epic 1 - Create todo flow
FR-005: Epic 1 - View todos newest-first
FR-006: Epic 1 - Toggle completion
FR-007: Epic 1 - Delete todo
FR-008: Epic 1 - CRUD API endpoints
FR-009: Epic 1 - Durable persistence after refresh
FR-010: Epic 1 - Correct HTTP success/failure statuses
FR-011: Epic 2 - Initial load state branching
FR-012: Epic 1 - Completed visual distinction
FR-013: Epic 2 - Mutation error messaging
FR-014: Epic 2 - Responsive usability (360px-1440px)

## Epic List

### Epic 1: Manage Todos End-to-End
Users can create, view, complete, and delete todos with persistent data and consistent API behavior.
**FRs covered:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-012

### Epic 2: Reliable and Accessible Todo Experience
Users get clear app states (loading/empty/error/list), responsive layouts, and usable feedback across devices and assistive usage patterns.
**FRs covered:** FR-011, FR-013, FR-014

## Epic 1: Manage Todos End-to-End

Users can create, view, complete, and delete todos with persistent data and consistent API behavior.

### Story 1.1: Initialize Full-Stack Foundation and Todo Data Model

As a developer,
I want a scaffolded full-stack project with todo schema and migration,
So that todo features can be built on a durable and reproducible baseline.

**Acceptance Criteria:**

**Given** a new repository workspace
**When** the project is initialized using Create T3 App and baseline configuration is committed
**Then** the app runs locally with documented setup commands
**And** Prisma is configured with a PostgreSQL datasource and an initial Todo schema containing `id`, `description`, `completed`, and `createdAt`

**Given** the initial Prisma schema
**When** migrations are created and applied
**Then** the `todos` table exists with required constraints including description length and non-null rules
**And** `completed` defaults to `false`

**Sizing Note (optional split if sprint capacity is tight):**
- Story 1.1A: Project scaffold and baseline runtime/tooling setup.
- Story 1.1B: Prisma schema, migration creation, and DB verification.

### Story 1.2: Implement Todo CRUD API with Validation and Error Contract

As a user,
I want stable API operations for todos,
So that create/view/update/delete actions behave consistently and persist data.

**Acceptance Criteria:**

**Given** API routes for todo CRUD
**When** valid requests are sent to create, list, update completion, and delete todos
**Then** the API returns successful HTTP status codes with consistent JSON success shape
**And** mutations are persisted and visible in subsequent reads

**Given** invalid or failing requests
**When** validation fails or a todo does not exist
**Then** the API returns appropriate HTTP error status codes
**And** errors follow a consistent JSON error envelope with code and message

### Story 1.3: Build Todo List and Create Flow in the UI

As an end user,
I want to add todos and immediately see them in my list,
So that I can quickly manage tasks.

**Acceptance Criteria:**

**Given** the app is loaded with an available backend
**When** I submit a valid todo description
**Then** a new todo appears in the list in newest-first order
**And** the input is cleared after successful creation

**Given** I submit empty, whitespace-only, or over-limit text
**When** client-side validation runs
**Then** the todo is not created
**And** clear validation feedback is shown

### Story 1.4: Implement Complete and Delete Todo Interactions

As an end user,
I want to complete and remove todos,
So that my list reflects current task status.

**Acceptance Criteria:**

**Given** an existing todo in the list
**When** I toggle its completion control
**Then** the todo visual style updates to indicate completed or incomplete state
**And** the changed state persists after page refresh

**Given** an existing todo in the list
**When** I activate delete on that item
**Then** the todo is removed from the visible list
**And** it does not reappear after refresh

## Epic 2: Reliable and Accessible Todo Experience

Users get clear app states (loading/empty/error/list), responsive layouts, and usable feedback across devices and assistive usage patterns.

### Story 2.1: Implement Initial Load States and Retryable Error Handling

As an end user,
I want clear feedback while the app loads or fails,
So that I always understand the current state and next action.

**Acceptance Criteria:**

**Given** the app requests todos on first load
**When** data is pending
**Then** a loading state is rendered
**And** loading indicators are announced/accessibly labeled where needed

**Given** the todos response is empty
**When** loading completes successfully
**Then** an empty-state message is shown
**And** it guides the user to create a first todo

**Given** initial fetch fails
**When** an error occurs
**Then** an error state with user-readable message is displayed
**And** a retry action is available and triggers a new fetch attempt

### Story 2.2: Implement Mutation Error Feedback and Latency-Aware UI Updates

As an end user,
I want immediate and understandable feedback on todo actions,
So that I can trust the system response.

**Acceptance Criteria:**

**Given** create/toggle/delete actions succeed
**When** API responses are returned
**Then** UI updates are visible within 300ms measured from response receipt to DOM update timestamp in integration tests
**And** the latency assertion passes for 95/100 local test iterations per mutation type (create/toggle/delete)
**And** interaction states are consistent with server state

**Given** create/toggle/delete actions fail
**When** API errors are returned
**Then** a non-blocking, user-readable error message is displayed
**And** the error message includes operation context (`create`, `toggle`, or `delete`) and recovery guidance
**And** the interface remains usable for subsequent actions without page reload

### Story 2.3: Deliver Responsive and Accessible Main Todo Flow

As an end user,
I want the todo app to work across devices and input methods,
So that I can use it effectively on mobile and desktop.

**Acceptance Criteria:**

**Given** viewport widths between 360px and 1440px
**When** I use the main todo flow at 360px, 768px, 1024px, and 1440px
**Then** no horizontal scrollbar appears on the page
**And** create/toggle/delete controls remain visible, reachable, and operable at each viewport

**Given** keyboard-only navigation
**When** I tab through create, toggle, and delete controls
**Then** all interactive elements are reachable and operable
**And** controls expose accessible labels and visible focus indicators
**And** automated accessibility checks report zero critical violations for the main todo flow pages
