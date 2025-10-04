import Link from "next/link";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { BackgroundBoxes } from "@/components/ui/background-boxes";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { GlimmeringMapCard } from "@/components/glimmering-map-card";

const testimonials = [
  {
    quote:
      "Vector let us iterate NPIs in minutes, not days. The worker telemetry kept our ops team aligned in the heat of an outbreak.",
    name: "Amara Feld",
    title: "Chief Epidemiologist, Meridian Health",
  },
  {
    quote:
      "The live map stream and replayable runs changed how we brief leadership. Scenario diffs are now part of every stand-up.",
    name: "Diego Morales",
    title: "Incident Commander, Coastline Response",
  },
  {
    quote:
      "From Supabase policies to Prometheus dashboards, the defaults are secure and production-ready out of the box.",
    name: "Priya Natarajan",
    title: "Director of Platform Security, Quantisphere",
  },
];

const heroHighlights = [
  {
    label: "Realtime Rt",
    value: "0.82",
    detail: "Autonomous smoothing with provenance",
  },
  {
    label: "Hospital Overflow",
    value: "0 days",
    detail: "Adaptive surge modelling across regions",
  },
  {
    label: "Scenario Uptime",
    value: "99.95%",
    detail: "Redis-backed job queue with resumable checkpoints",
  },
];

const missionPoints = [
  { label: "Seed outbreaks", description: "Kick off deterministic or stochastic SEIRD runs with a single command." },
  { label: "Compose interventions", description: "Layer NPIs, mobility edits, and vaccination phases on a shared timeline." },
  { label: "Broadcast insights", description: "Stream live KPIs, generate reports, and notify squads with runId traces." },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <BackgroundBoxes className="opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent)/0.25,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--background),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row lg:gap-16">
        <AppSidebar className="lg:sticky lg:top-12 lg:self-start" />

        <main className="flex-1 space-y-16 pb-20">
          <section id="overview" className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                Vector Glimmering Map
              </span>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                  Orchestrate outbreak strategy with a living systems map.
                </h1>
                <p className="text-lg text-muted-foreground">
                  Design a pathogen, drop patient zero, and watch deterministic SEIRD simulations braid through regions in real time. Adjust mobility, NPIs, and vaccination—all while the system quantifies risk and resilience.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/scenario/new"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
                >
                  Launch a simulation
                </Link>
                <Link
                  href="/gallery"
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
                >
                  Explore gallery
                </Link>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6 rounded-3xl border border-border bg-card/80 p-6 shadow-[var(--shadow-md)] backdrop-blur">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Response playbook
                </h2>
                <ul className="space-y-4">
                  {missionPoints.map((point) => (
                    <li key={point.label} className="rounded-2xl border border-border/50 bg-background/80 px-4 py-4">
                      <p className="text-sm font-semibold text-foreground">{point.label}</p>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <GlimmeringMapCard />
            </div>
          </section>

          <section id="simulation" className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Live telemetry</h2>
                <p className="text-sm text-muted-foreground">Every run streams KPIs, queue health, and guardrail alerts directly into your ops console.</p>
              </div>
              <Link
                href="/run/demo"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
              >
                View demo run
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="dashboards" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Ops teams love the cadence</h2>
            <p className="text-sm text-muted-foreground">
              Keep epidemiology, data science, and leadership aligned with narratives that stream directly from vectorised simulations.
            </p>
            <InfiniteMovingCards items={testimonials} speed="normal" />
          </section>

          <section id="reports" className="space-y-6">
            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-[var(--shadow-md)] backdrop-blur">
              <h2 className="text-2xl font-semibold text-foreground">Reports, exports, and guardrails</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Auto-generate PDF briefings, ship CSV datasets, and integrate with Prometheus, Grafana, and Sentry to close the loop across observability and compliance.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1">Problem+JSON everywhere</span>
                <span className="rounded-full border border-border px-3 py-1">OpenTelemetry traces</span>
                <span className="rounded-full border border-border px-3 py-1">Supabase RLS policies</span>
                <span className="rounded-full border border-border px-3 py-1">Docker & SBOM ready</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
