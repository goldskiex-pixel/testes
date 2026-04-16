# Oitchau Setup Automation Platform (V1)

Production-minded MVP monorepo for automating spreadsheet-based Oitchau setup.

## Monorepo structure

- `backend/`: NestJS + Prisma + PostgreSQL API.
- `frontend/`: Next.js (App Router) + Tailwind internal tool UI.
- `docker-compose.yml`: local PostgreSQL + backend + frontend.

## Key architecture decisions

1. **Pluggable pipeline**: parser, validation, transformation, and execution are independent services with entity-level handlers to allow easy extension.
2. **Execution abstraction**: in-process queue (`ExecutionQueueService`) with a clear interface to later swap for BullMQ/worker architecture.
3. **Credential isolation**: credentials are never returned in client list/detail responses. Encrypted-at-rest is marked as TODO for production hardening.
4. **Staging-only enforcement**: execution is blocked in both frontend UI and backend service if environment is not `STAGING`.
5. **Validation layering**: structural + referential + business-rule validation with row/field-aware issue objects.
6. **Typed contracts**: shared DTO style in frontend and backend for maintainability.

## Tech stack

- Frontend: Next.js 15, React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, Prisma
- DB: PostgreSQL
- File parsing: `xlsx`
- Validation schemas: `zod`
- Logging: `pino`
- Testing: Jest unit and integration examples
- Containers: Docker + docker-compose

> Library choice note: `zod` is used for schema-driven validation because it keeps runtime and type-level definitions in one place, reducing drift in parser/validator contracts.

## Setup

### 1) Environment

Copy `.env.example` files:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env.local`

### 2) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Database

```bash
cd backend
npx prisma migrate dev
npm run prisma:seed
```

### 4) Run locally

```bash
# terminal 1
cd backend && npm run start:dev

# terminal 2
cd frontend && npm run dev
```

### 5) Docker

```bash
docker compose up --build
```

## API overview

Base path: `/api`

- `POST /auth/login`
- `GET /clients`
- `POST /clients`
- `PATCH /clients/:id`
- `PUT /clients/:id/credentials`
- `POST /uploads`
- `GET /runs`
- `GET /runs/:id`
- `GET /runs/:id/validation`
- `GET /runs/:id/preview`
- `POST /runs/:id/execute`
- `POST /runs/:id/dry-run`
- `POST /runs/:id/retry-failed`
- `GET /runs/:id/export-errors`

## Current implementation status

### Fully implemented

- NestJS scaffold with modular services/controllers.
- Prisma schema for required core models with seed script.
- Upload lifecycle record creation and parsing pipeline trigger.
- Multi-tab parser architecture for six entities.
- 3-layer validation engine and persistence of issues.
- Transformation engine + preview output.
- Execution orchestration skeleton with retry policy and per-record logs/status.
- Frontend pages for login/dashboard/clients/upload/run history/run details/validation/preview.
- Reusable UI components: tables, cards, badges, JSON viewer.
- Docker and local run configuration.
- Example unit/integration tests for parser/validation/execution.

### Scaffolded / TODO hardening

- Real JWT/session auth guard enforcement on all backend routes.
- Credential encryption and secret manager integration.
- Replace in-process queue with BullMQ workers.
- Full pagination/filtering server-side for large data volumes.
- Advanced observability, rate limiting, and audit policies.
- Complete spreadsheet template versioning and migration strategy.

## Assumptions

- Internal users are trusted enough for local auth in V1.
- Spreadsheet template contains specific tab/column naming included in parser configs.
- Oitchau API supports idempotency keys per record (fallback generated from run+entity+external key).
- For V1, all executions target staging; production records may exist but are blocked from execution.

## Next best implementation tasks

1. Add true auth guards + role-based route decorators.
2. Implement encrypted credential storage with managed keys.
3. Add background workers and robust retry backoff persistence.
4. Expand entity parser catalog and template version checks.
5. Build richer run detail polling/live updates via SSE/WebSocket.
6. Add end-to-end tests across upload→validate→execute→retry.
