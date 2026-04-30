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

## Validate Prisma client and schema

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
