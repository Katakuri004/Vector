import clsx from "clsx";

/* eslint-disable security/detect-object-injection */

interface ScenarioDiffViewProps {
  readonly baseline: Record<string, number>;
  readonly challenger: Record<string, number>;
}

export function ScenarioDiffView({ baseline, challenger }: ScenarioDiffViewProps) {
  const metrics = Array.from(new Set([...Object.keys(baseline), ...Object.keys(challenger)]));

  return (
    <table className="w-full border-separate border-spacing-y-2 text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
          <th className="px-3">Metric</th>
          <th className="px-3">Baseline</th>
          <th className="px-3">Challenger</th>
          <th className="px-3">?</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => {
          const baseValue = Object.prototype.hasOwnProperty.call(baseline, metric)
            ? baseline[metric] ?? 0
            : 0; // eslint-disable-line security/detect-object-injection
          const challengerValue = Object.prototype.hasOwnProperty.call(challenger, metric)
            ? challenger[metric] ?? 0
            : 0; // eslint-disable-line security/detect-object-injection
          const delta = challengerValue - baseValue;
          return (
            <tr key={metric} className="rounded-xl border border-border bg-card text-card-foreground shadow-[var(--shadow-sm)]">
              <td className="px-3 py-2 font-medium">{metric}</td>
              <td className="px-3 py-2 text-muted-foreground">{baseValue.toFixed(2)}</td>
              <td className="px-3 py-2 text-muted-foreground">{challengerValue.toFixed(2)}</td>
              <td
                className={clsx("px-3 py-2 font-semibold", {
                  "text-destructive": delta > 0,
                  "text-accent-foreground": delta <= 0,
                })}
              >
                {delta >= 0 ? "+" : ""}
                {delta.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* eslint-enable security/detect-object-injection */


