# Operations Runbook

## Local Development
1. Install Node 20+ and Python 3.11+.
2. 
pm install at repo root (bootstraps workspaces).
3. Create .env files:
   - pps/web/.env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/v1, NEXT_PUBLIC_MAPBOX_TOKEN=..., Clerk keys.
   - pps/api/.env: DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/epidemic, REDIS_URL=redis://localhost:6379/0, SUPABASE_SERVICE_ROLE_KEY=..., CLERK_JWKS_URL=....
   - pps/worker/.env: DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/epidemic, REDIS_URL=redis://localhost:6379/0.
4. docker-compose up --build to start Postgres, Redis, API, worker, web, Prometheus, Grafana, OTEL collector.
5. Visit http://localhost:3000 for the frontend, http://localhost:8000/v1/docs for API docs, http://localhost:9090 (Prometheus), http://localhost:3001 (Grafana).

## Testing & Quality Gates
- 
pm run lint / 
pm run typecheck / 
pm run build (root) for JS packages.
- cd apps/api && pip install -e .[dev] && pytest && mypy && ruff check ..
- cd apps/worker && pip install -e .[dev] && pytest && mypy && ruff check ..
- End-to-end (future): Playwright scripts under pps/web/tests (placeholder).

## Deployments
- Web: Vercel (Next.js 14). Provide environment variables via Vercel project settings (Clerk keys, API base URL).
- API & Worker: container images (Dockerfiles included) deployable to Fly.io/Render/Kubernetes. Ensure OTLP endpoint + secrets configured via environment.
- Database: Supabase managed Postgres with RLS policies matching SQLAlchemy models (implement migrations using Alembic or Supabase SQL).

## Incident Response
- SLOs: Frame latency p95 < 500ms, queue lag < 1 job, API availability 99.5%.
- Dashboards: Grafana board (to author) summarising Prometheus metrics exported by API/worker.
- On alert: Inspect Redis queue depth, confirm worker health, replay job via q requeue <job_id> if needed.
- Logging: Structured JSON via structlog (API & worker); correlate by correlationId/RunId.

## Secrets Management
- Use environment variables or secret managers (Supabase/Vercel/Fly). Never commit keys.
- Clerk JWKS endpoint configurable; rotate keys by updating environment variables and reloading pods.

## Backups & Data Retention
- Supabase automated backups recommended daily. Run-series table can be tiered to TimescaleDB for retention policies (todo).
- Redis ephemeral; ensure job payloads are idempotent and can be replayed from Postgres state if redis flushes.
