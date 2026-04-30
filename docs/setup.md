# Setup Guide

## Prerequisites

- Node.js 22 LTS
- npm 10+
- Docker or Podman

## Install dependencies

```bash
npm install
```

## Start local PostgreSQL

```bash
./start-database.sh
```

## Generate and apply Prisma migration

```bash
npx prisma migrate dev --name init_todo_model
```

## Generate Prisma client

```bash
npm run db:generate
```

## Run Story 1.1 integration check

```bash
npm run db:check:todo-default
```

This check inserts a todo without explicitly setting `completed` and verifies persisted default `completed=false`.

## Run app

```bash
npm run dev
```

## Verify UI list, create flow, complete, and delete

1. Open `http://localhost:3000`.
2. Create a todo and confirm:
- it appears in the list immediately
- newest items render first
- input clears after successful submit
3. Submit empty/whitespace-only/over-limit text and confirm inline validation feedback is shown.
4. Use the checkbox on a todo to mark it complete or incomplete and confirm styling updates; refresh and confirm the state matches the server.
5. Use Delete on a todo and confirm it disappears immediately; refresh and confirm it stays removed.
6. Simulate a failing initial todo request (stop the backend or block `GET /api/todos`), then confirm an error appears with **Retry loading todos** and that recovering the API and clicking retry loads the list again.
