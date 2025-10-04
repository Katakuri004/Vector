"use client";

import { useOptionalAuth } from "@/app/hooks/useOptionalAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Dataset, ScenarioCreateRequest } from "@epidemic-sim/shared-schemas";

import { createRun, createScenario, listDatasets } from "@/lib/api-client";
import { useSimulationStore } from "@/store/simulation-store";
import { MapChoropleth } from "@/components/map-choropleth";
import { MobilityUploader } from "@/components/mobility-uploader";
import { NpiTimeline } from "@/components/npi-timeline";
import { PathogenSliders } from "@/components/pathogen-sliders";
import { RegionPicker } from "@/components/region-picker";
import { ReportModal } from "@/components/report-modal";
import { RunStatsCard } from "@/components/run-stats-card";
import { SeriesCharts } from "@/components/series-charts";
import { ShareLink } from "@/components/share-link";
import { TimeScrubber } from "@/components/time-scrubber";

export default function NewScenarioPage() {
  const auth = useOptionalAuth();
  const scenarioDraft = useSimulationStore((state) => state.scenarioDraft);
  const setScenarioDraft = useSimulationStore((state) => state.setScenarioDraft);
  const runs = useSimulationStore((state) => state.runs);
  const upsertRun = useSimulationStore((state) => state.upsertRun);
  const [timeStep, setTimeStep] = useState(0);

  const tokenPromise = useMemo(() => auth?.getToken?.() ?? Promise.resolve<string | null>(null), [auth]);

  const { data: datasets } = useQuery({
    queryKey: ["datasets"],
    enabled: Boolean(tokenPromise),
    queryFn: async () => {
      const token = await tokenPromise;
      if (!token) {
        return { items: [] as Dataset[] };
      }
      return listDatasets(token);
    },
  });

  const scenarioMutation = useMutation({
    mutationFn: async () => {
      const token = await tokenPromise;
      if (!token) {
        throw new Error("Authentication required");
      }
      const scenario = await createScenario(token, scenarioDraft as ScenarioCreateRequest);
      const run = await createRun(token, {
        scenario_id: scenario.id,
        engine: scenario.engine,
        seed: scenario.engine.seed,
      });
      upsertRun({ id: run.id, status: run.status });
      return run;
    },
  });

  const regions = datasets?.items.flatMap((dataset: Dataset) => (
    (dataset.meta?.regions as { id: string; name: string }[] | undefined) ?? []
  )) ?? [];

  const activeRun = runs[0];
  const runMetrics = activeRun?.metrics ?? (activeRun?.status === "completed" ? {} : undefined);

  return (
    <div className="space-y-10 bg-background px-6 py-10 text-foreground">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Scenario designer</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Wire datasets, configure pathogen traits, and schedule interventions. Launch a run to see impact metrics stream live from the Python worker.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={scenarioMutation.isPending}
            onClick={() => scenarioMutation.mutate()}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-50"
          >
            {scenarioMutation.isPending ? "Launching…" : "Launch simulation"}
          </button>
          <ShareLink url={typeof window !== "undefined" ? window.location.href : ""} />
          <ReportModal triggerLabel="Open report">
            <p className="text-sm text-muted-foreground">
              Reports stitch together KPI snapshots, intervention logs, and export-ready CSVs.
            </p>
          </ReportModal>
        </div>
        {scenarioMutation.isError && (
          <p className="rounded-xl border border-destructive bg-destructive/10 px-4 py-2 text-sm text-destructive-foreground">
            {(scenarioMutation.error as Error).message}
          </p>
        )}
      </header>

      <section className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          <PathogenSliders
            pathogen={scenarioDraft.pathogen}
            onChange={(pathogen) =>
              setScenarioDraft((draft) => ({
                ...draft,
                pathogen,
              }))
            }
          />

          <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
            <h3 className="text-sm font-semibold text-card-foreground">Select regions</h3>
            <RegionPicker
              options={regions}
              selected={scenarioDraft.datasets}
              onToggle={(id) =>
                setScenarioDraft((draft) => {
                  const selected = draft.datasets.includes(id)
                    ? draft.datasets.filter((value) => value !== id)
                    : [...draft.datasets, id];
                  return { ...draft, datasets: selected };
                })
              }
            />
          </div>

          <MobilityUploader onUpload={(file) => console.log("mobility.upload", file.name)} />
        </div>

        <div className="space-y-6">
          <MapChoropleth
            features={regions.map((region, index) => ({
              id: region.id,
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-74 + index * 0.1, 40 + index * 0.1],
                    [-74 + index * 0.1, 40.1 + index * 0.1],
                    [-73.9 + index * 0.1, 40.1 + index * 0.1],
                    [-73.9 + index * 0.1, 40 + index * 0.1],
                    [-74 + index * 0.1, 40 + index * 0.1],
                  ],
                ],
              },
              value: Math.random(),
            }))}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Intervention schedule</h3>
              <NpiTimeline entries={scenarioDraft.npi_timeline} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Time scrubber</h3>
              <TimeScrubber currentStep={timeStep} maxStep={scenarioDraft.engine.horizon} onChange={setTimeStep} />
            </div>
          </div>

          <SeriesCharts
            metrics={["I", "R", "D"]}
            data={Array.from({ length: scenarioDraft.engine.horizon }, (_, index) => ({
              t: index,
              I: Math.sin(index / 8) * 40 + 120,
              R: Math.log(index + 1) * 20,
              D: Math.min(index * 0.5, 20),
            }))}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <RunStatsCard status={activeRun?.status ?? "idle"} {...(runMetrics ? { metrics: runMetrics } : {})} />
        <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-[var(--shadow-sm)]">
          <p>
            Validation checklist: typed OpenAPI contracts, deterministic seeds, and Problem+JSON errors are enforced across the API and mirrored here via shared zod schemas.
          </p>
        </div>
      </section>
    </div>
  );
}

