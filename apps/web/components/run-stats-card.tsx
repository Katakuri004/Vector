interface RunStatsCardProps {
  readonly status: string;
  readonly metrics?: Record<string, number>;
}

export function RunStatsCard({ status, metrics }: RunStatsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-card-foreground">Run status</p>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {status}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
        {metrics ? (
          Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-border/60 bg-background px-3 py-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{key}</dt>
              <dd className="text-base font-semibold text-foreground">{value.toFixed(2)}</dd>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Metrics will appear when the simulation completes.</p>
        )}
      </dl>
    </div>
  );
}

