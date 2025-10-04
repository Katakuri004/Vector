# Gap Analysis

## Current State
- Single Next.js app scaffold under pps/web (formerly root) with default landing page.
- No backend (FastAPI), worker, shared schema package, or infrastructure tooling.
- No TypeScript strict config, Zustand store, domain components, or API integrations.
- No Python environment, Redis queue setup, or Supabase/Postgres migrations.
- Documentation limited to original README.

## Required Additions
- Establish monorepo structure with Next.js (App Router), FastAPI API, Python worker, shared schemas.
- Implement SEIRD simulation logic, job queue integration, and Supabase/Postgres schema + migrations.
- Build specified frontend pages/components, state management, theming with provided tokens, SSE/WS streaming.
- Enforce security controls, Problem+JSON error handling, logging/tracing/metrics instrumentation.
- Provide GitHub Actions, Docker Compose, tests (unit, property, integration, E2E stubs), and comprehensive docs.
