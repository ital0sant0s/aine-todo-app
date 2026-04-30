# Aine Todo App

Full-stack web app for managing personal todos: create, list, complete, and delete tasks. V1 is single-user with no authentication.

## Stack

- [Next.js](https://nextjs.org/) 15 (Pages Router), React 19, TypeScript
- [Prisma](https://www.prisma.io/) 6 and PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/) 4
- API routes under `src/pages/api`

## Prerequisites

- Node.js 22 LTS and npm 10+
- Docker (or Podman) for a local database, or for running the full stack via Compose

## Environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

`DATABASE_URL` must be a valid URL (see `src/env.js`). The default in `.env.example` uses PostgreSQL on `localhost:5433`.

## Local development (Node on the host)

1. Install dependencies: `npm install`
2. Start PostgreSQL (script reads `DATABASE_URL` from `.env`): `./start-database.sh`
3. Apply migrations: `npx prisma migrate dev`
4. Run the app: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

More detailed steps and manual checks are in [docs/setup.md](docs/setup.md).

## Docker

Production-style image (Next.js `standalone` output) plus a Compose file that runs the app and PostgreSQL together.

**Build the app image:**

```bash
docker build -t aine-todo-app:local .
```

**Run app + database:**

```bash
docker compose up --build
```

The app listens on [http://localhost:3000](http://localhost:3000). On each start, the container runs `prisma migrate deploy` against the `db` service, then starts Next.js.

Compose uses the example credentials `postgres` / `password` and an internal database name `aine-todo-app-v3`. Change these for any real deployment. Postgres is not published to the host by default (only the app port `3000` is), so it does not clash with `./start-database.sh` on port 5433. To expose Postgres on the host, add under the `db` service in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` / `npm run start` | Production build and server |
| `npm run check` | Lint and TypeScript check |
| `npm run test:ui` | Vitest + Testing Library UI tests |
| `npm run test:all` | Node tests and UI tests |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:studio` | Prisma Studio |

## Documentation

- [docs/setup.md](docs/setup.md) — setup, migrations, and manual verification
- [docs/prd.md](docs/prd.md) — product requirements

## Deployment

The project follows common Next.js deployment options (for example Vercel). For Docker-based hosting, use the included `Dockerfile` and set `DATABASE_URL` to your managed PostgreSQL instance. Builds can use `SKIP_ENV_VALIDATION=1` when required variables are injected only at runtime (see `src/env.js` and `next.config.js`).
