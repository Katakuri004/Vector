import { ScenarioDiffView } from "@/components/scenario-diff-view";

const baseline = {
  peakInfected: 245.21,
  hospitalOverflowDays: 3,
  attackRate: 0.45,
};

const challenger = {
  peakInfected: 180.04,
  hospitalOverflowDays: 0,
  attackRate: 0.31,
};

export default function ComparePage() {
  return (
    <div className="space-y-6 bg-background px-6 py-10 text-foreground">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Scenario compare</h1>
        <p className="text-sm text-muted-foreground">
          Compare metrics across two simulation runs to understand how interventions shift key KPIs.
        </p>
      </header>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
        <ScenarioDiffView baseline={baseline} challenger={challenger} />
      </div>
    </div>
  );
}

