interface NpiTimelineProps {
  readonly entries: readonly {
    readonly day: number;
    readonly active: readonly string[];
  }[];
}

export function NpiTimeline({ entries }: NpiTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
        Configure NPIs to see when each intervention activates.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.day} className="rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Day {entry.day}</span>
            <span>{entry.active.length} active</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.active.map((id) => (
              <span
                key={id}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {id}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

