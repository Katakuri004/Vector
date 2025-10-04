const demos = [
  {
    id: "urban-lockdown",
    title: "Urban lockdown",
    outcome: "Peak Rt 0.74, hospital overflow avoided",
  },
  {
    id: "school-closure",
    title: "School closures + masking",
    outcome: "Attack rate -18% vs baseline",
  },
  {
    id: "travel-curb",
    title: "Travel curbs",
    outcome: "Delayed peak by 3 weeks",
  },
];

export default function GalleryPage() {
  return (
    <div className="space-y-6 bg-background px-6 py-10 text-foreground">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Scenario gallery</h1>
        <p className="text-sm text-muted-foreground">
          Explore curated scenarios illustrating different non-pharmaceutical interventions and pathogen traits.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {demos.map((demo) => (
          <article key={demo.id} className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-card-foreground">{demo.title}</h2>
            <p className="text-sm text-muted-foreground">{demo.outcome}</p>
            <button className="text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60">
              Duplicate into workspace
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

