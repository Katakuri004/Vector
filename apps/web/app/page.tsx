import Link from "next/link";

const features = [
  {
    title: "Mechanistic Accuracy",
    description:
      "Deterministic SEIRD engine with mobility, NPIs, vaccination, and age structure ready to toggle on demand.",
  },
  {
    title: "Live Decisioning",
    description:
      "Stream frames straight from Python workers and rehearse interventions with millisecond feedback loops.",
  },
  {
    title: "Secure Collaboration",
    description:
      "Clerk-backed auth, Supabase RLS, and complete audit trails keep sensitive outbreak scenarios isolated.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              OWASP ASVS L2+ ready
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Build, stress-test, and ship outbreak playbooks with confidence.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Vector orchestrates a complete epidemic simulation stack—from typed contracts and
              observability to live dashboards—so your teams can explore interventions before the
              first case lands.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/scenario/new"
                className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
              >
                Launch scenario designer
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-border px-6 py-3 text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
              >
                Browse demo gallery
              </Link>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lg)]">
            <div className="grid gap-4 text-sm text-card-foreground">
              <div>
                <p className="font-medium text-muted-foreground">Realtime KPIs</p>
                <p className="text-lg">Rt 0.82 · Peak load -32% · Hospital overflow: 0 days</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                <span className="rounded-lg bg-secondary/40 px-3 py-2 text-center text-secondary-foreground">
                  Lockdown tier 2
                </span>
                <span className="rounded-lg bg-secondary/40 px-3 py-2 text-center text-secondary-foreground">
                  Schools hybrid
                </span>
                <span className="rounded-lg bg-secondary/40 px-3 py-2 text-center text-secondary-foreground">
                  Mask mandate
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background px-4 py-5">
                <p className="flex items-baseline justify-between text-sm">
                  <span>Latency</span>
                  <span className="font-semibold text-primary">p95 420ms</span>
                </p>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div className="h-2 w-3/4 rounded-full bg-primary" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]"
            >
              <h2 className="text-xl font-semibold text-card-foreground">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

