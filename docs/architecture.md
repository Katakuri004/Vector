# Epidemic-Sim Architecture Overview

## Monorepo Layout
- pps/web: Next.js 14 frontend (App Router) with Clerk auth, Zustand state, Mapbox GL visuals, Recharts dashboards, and problem+JSON aware API client.
- pps/api: FastAPI backend exposing typed REST endpoints, Problem+JSON errors, OpenTelemetry hooks, Prometheus metrics, Redis job orchestration, and Supabase Postgres persistence.
- pps/worker: Python simulation worker (NumPy + Numba) consuming Redis queues, executing SEIRD with RK4 integration, and streaming frames via Pub/Sub.
- packages/shared-schemas: Zod schemas + TS types shared across web and backend for DTO parity.
- docs: Requirements, ADRs, runbooks, architecture notes.
- infrastructure: Docker Compose + observability config (OTel collector, Prometheus, Grafana).

## Data Flow
1. Frontend authenticates with Clerk, persists scenario state in Zustand, and invokes FastAPI via fetch using shared schemas for validation.
2. FastAPI persists scenario/run definitions in Supabase Postgres, enforces Problem+JSON error shape, and enqueues simulation jobs on Redis with deterministic un_id (idempotency guard).
3. Worker consumes jobs, loads scenario parameters, runs vectorised SEIRD (NumPy/Numba) with mobility + NPI schedule, writes run series back to Postgres, publishes live frames on Redis Pub/Sub, and emits Prometheus metrics.
4. Frontend subscribes to EventSource stream (/runs/:id/stream?token=) and renders charts, choropleths, and dashboards in near real time.

## Security & Observability
- CSP, frame denial, and permissions policy headers configured in 
ext.config.ts.
- Clerk JWKS verification in API (esolve_auth), idempotency storage in Redis, and Problem+JSON responses with correlation IDs.
- OpenTelemetry instrumentation for FastAPI and worker (OTLP endpoint configurable) plus Prometheus metrics at /v1/metrics.
- Supabase Postgres expected to enforce RLS (owner-based) via migrations (future work), with SQLAlchemy models aligning to required schema.

## Testing & Quality Gates
- pps/api: pytest (async) smoke test for health endpoint, mypy/ruff strict settings, OpenAPI generator script.
- pps/worker: pytest covering SEIRD invariants (population conservation), mypy/ruff strict, vectorised kernel under Numba JIT.
- pps/web: ESLint (Next + React + security), strict TypeScript, shared zod schemas, automated color token enforcement via Tailwind theme.
- Root scripts orchestrate lint/typecheck/build across packages; CI (to be wired) runs these plus docker builds.
