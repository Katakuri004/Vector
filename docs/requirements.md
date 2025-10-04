

# Epidemic-Sim Requirements Summary

## Non-Negotiables
- Follow prescribed tech stack (Next.js 14, FastAPI, Redis queue, Supabase Postgres).
- Enforce strict type safety (TypeScript strict, zod, Pydantic v2, mypy/pyright).
- Implement security controls per OWASP ASVS L2+ and Problem+JSON error schema.
- Use only provided design tokens for theming and maintain observability (OTel, Prometheus, Sentry).

## Product Scope
- Web strategy game modelling infectious disease spread with SEIRD dynamics.
- Players configure pathogens, datasets, NPIs, and monitor live simulation outputs.
- KPIs: incidence, prevalence, Rt, time-to-peak, attack rate, hospital overflow days, deaths.

## Architecture
- Monorepo epidemic-sim/ with apps: Next.js frontend, FastAPI backend, Python worker.
- Redis-backed job queue connecting API and worker; Supabase Postgres for persistence.
- Shared schema package exporting zod (TS) and generated Python DTOs; OpenAPI 3.1 as contract.

## Frontend Feature Set
- Required routes: /, /scenario/new, /run/[id], /compare, /gallery.
- Core components: MapChoropleth, TimeScrubber, SeriesCharts, NpiTimeline, PathogenSliders,
  MobilityUploader, RegionPicker, RunStatsCard, ReportModal, ShareLink, ScenarioDiffView.
- State via Zustand; data via REST + server actions; WS/SSE stream frames; charts use Recharts/ECharts with token colours.
- Accessibility: keyboard navigation, focus rings, prefers-reduced-motion, AAA contrast.

## Backend & Worker
- FastAPI endpoints for health, auth handoff, datasets, regions, mobility, scenarios, runs, streaming frames.
- Consistent Problem+JSON errors, rate limiting, idempotency keys, ETags, pagination, filtering.
- Worker executes SEIRD with RK4, optional stochasticity, NPIs, vaccinations, mobility flows.
- Metrics: steps/sec, frame latency, DB write rate; deterministic RNG with seeds; queue checkpointing.

## Data Model Essentials
- Tables: users, datasets, regions, mobility_edges, pathogens, scenarios, runs, run_series, artifacts.
- Enforce RLS (owner-based) and indexes; consider Timescale hypertable for run_series.

## DevOps & Quality
- GitHub Actions: lint, type-check, tests, SCA, SBOM, Docker, Trivy, Cosign signing.
- Docker Compose for dev (web, api, worker, redis, supabase/postgres).
- Testing: unit, property, integration, E2E (Playwright), security tests.
- Docs: README, ADRs, runbooks, API docs; deliver demo seed + compose up.
