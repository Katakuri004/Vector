# Epidemic Simulation Platform

Secure, type-safe monorepo delivering a web-based infectious disease simulation experience. The stack pairs a Next.js 14 frontend with a FastAPI backend, a NumPy/Numba worker, and shared zod schemas to guarantee contract parity. Observability, security, and Problem+JSON error semantics follow the strict product specification in context.md.

## Repository Layout

`
apps/
  web/      ? Next.js 14 (App Router) UI with Clerk auth, Tailwind, Mapbox GL, Recharts, Zustand
  api/      ? FastAPI backend (Pydantic v2, SQLAlchemy async, Redis RQ, Problem+JSON, OTEL, Prometheus)
  worker/   ? Python simulation worker (NumPy + Numba RK4 SEIRD, Redis pub/sub, Prometheus)
packages/
  shared-schemas/ ? Zod schemas + TypeScript types shared across services
infrastructure/   ? Docker Compose, OTEL collector, Prometheus config
docs/             ? Requirements, architecture notes, ADRs, runbooks
`

## Quick Start

> Prerequisites: Node 20+, Python 3.11+, Docker.

`ash
npm install                           # bootstrap workspaces
docker-compose up --build              # start postgres, redis, api, worker, web, observability
`

Configure environment variables before launching:

- pps/web/.env.local: NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_MAPBOX_TOKEN, Clerk publishable key.
- pps/api/.env: DATABASE_URL, REDIS_URL, SUPABASE_SERVICE_ROLE_KEY, CLERK_JWKS_URL, optional SENTRY_DSN.
- pps/worker/.env: DATABASE_URL, REDIS_URL, optional OTEL_EXPORTER_OTLP_ENDPOINT.

Frontend: http://localhost:3000
API docs: http://localhost:8000/v1/docs
Prometheus: http://localhost:9090
Grafana: http://localhost:3001

## Tooling & Quality Gates

- 
pm run lint / 
pm run typecheck / 
pm run build (root) ? orchestrates shared schemas + web.
- cd apps/api && pip install -e .[dev] && ruff check . && mypy && pytest.
- cd apps/worker && pip install -e .[dev] && ruff check . && mypy && pytest.
- OpenAPI spec: python apps/api/scripts/generate_openapi.py (writes pps/api/openapi.json).

## Key Features

- **Contracts**: Shared zod + Pydantic DTOs, OpenAPI 3.1 generation, Problem+JSON errors with correlation IDs.
- **Security**: Clerk JWT validation (query or header), RLS-ready models, security headers, idempotency cache in Redis.
- **Observability**: OTEL instrumentation, Prometheus metrics (/v1/metrics), Grafana-ready dashboards, structured logging.
- **Simulation**: Vectorised SEIRD with RK4 integration, mobility + NPI schedule hooks, deterministic seeds, Redis Pub/Sub streaming.
- **UI**: Mapbox choropleth, Recharts dashboard, accessible controls, Tailwind theme locked to provided color tokens.

## Documentation

- docs/requirements.md – distilled system requirements from context.md.
- docs/architecture.md – monorepo architecture, data flow, quality gates.
- docs/runbook.md – ops procedures, SLIs/SLOs, deployment guidance.
- docs/adr/0001-monorepo.md – ADR covering stack selection.

## Next Steps

- Implement Supabase migrations + RLS policies to match ORM models.
- Expand test coverage (DTO property tests, SSE integration, Playwright E2E).
- Wire CI (GitHub Actions) for lint/typecheck/tests, SBOM generation, container build & scan (cosign, trivy).
