# ADR 0001: Monorepo & Technology Stack

## Status
Accepted (2025-10-05)

## Context
The product specification mandates a monorepo hosting a Next.js 14 frontend, FastAPI backend, Python simulation worker, and shared schema package. We require strict typing across TypeScript and Python, Redis-backed job orchestration, Supabase Postgres, and cohesive observability.

## Decision
- Adopt an npm workspace monorepo with structure pps/ (web/api/worker) and packages/shared-schemas for DTO parity.
- Use Next.js 14 App Router with Clerk auth, Tailwind, Mapbox GL, Recharts, Zustand.
- Implement FastAPI with SQLAlchemy (async), Pydantic v2, Problem+JSON errors, Redis (RQ) queue, OTEL + Prometheus.
- Build Python worker with NumPy + Numba RK4 integrator, Redis pub/sub streaming, Prometheus metrics.
- Share contracts via zod schemas compiled into TS types and mirrored Pydantic models.
- Standardise docs (requirements, architecture, ADRs, runbooks) within repo.

## Consequences
- Single repository simplifies version alignment and CI but requires tooling to orchestrate multi-language builds.
- Workspace approach allows 
pm install to bootstrap shared packages but still demands Python dependency management for API/worker.
- Strict typing and Problem+JSON enforcement increase upfront effort yet reduce integration defects.
- Mapbox GL introduces dependency on access tokens; we provide graceful fallbacks when tokens absent.
