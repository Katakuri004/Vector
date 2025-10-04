"use client";

import { useOptionalAuth } from "@/app/hooks/useOptionalAuth";
import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";

import { openRunStream } from "@/lib/api-client";
import { RunStatsCard } from "@/components/run-stats-card";
import { SeriesCharts } from "@/components/series-charts";
import { TimeScrubber } from "@/components/time-scrubber";

interface FramePoint extends Record<string, number> {
  readonly t: number;
  readonly I: number;
  readonly R: number;
  readonly D: number;
}

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = params?.id;
  const auth = useOptionalAuth();
  const tokenPromise = useMemo(() => auth?.getToken?.() ?? Promise.resolve<string | null>(null), [auth]);
  const [frames, setFrames] = useState<FramePoint[]>([]);
  const [timeStep, setTimeStep] = useState(0);
  const [status, setStatus] = useState("running");

  useEffect(() => {
    let dispose: (() => void) | null = null;

    (async () => {
      const token = await tokenPromise;
      if (!token || !runId) {
        return;
      }
      dispose = openRunStream(token, runId, (payload) => {
        const frame = payload as { t: number; series: Array<{ I: number; R: number; D: number }>; status?: string };
        if (frame.status) {
          setStatus(frame.status);
        }
        const aggregate = frame.series.reduce(
          (acc, value) => ({
            I: acc.I + value.I,
            R: acc.R + value.R,
            D: acc.D + value.D,
          }),
          { I: 0, R: 0, D: 0 },
        );
        setFrames((prev) => {
          if (prev.some((existing) => existing.t === frame.t)) {
            return prev;
          }
          return [...prev, { t: frame.t, ...aggregate }];
        });
      });
    })();

    return () => {
      dispose?.();
    };
  }, [runId, tokenPromise]);

  if (!runId) {
    notFound();
  }

  const chartData = frames.slice(0, Math.max(timeStep + 1, 1));
  const metrics = frames.length > 0 ? { peakInfected: Math.max(...frames.map((frame) => frame.I)) } : undefined;

  return (
    <div className="space-y-8 bg-background px-6 py-10 text-foreground">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Run {runId}</h1>
          <p className="text-sm text-muted-foreground">Live frames streamed from the simulation worker.</p>
        </div>
        <span className="rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
          Status {status}
        </span>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <SeriesCharts data={chartData} metrics={["I", "R", "D"]} />
          <TimeScrubber currentStep={timeStep} maxStep={Math.max(frames.length - 1, 0)} onChange={setTimeStep} />
        </div>
        <RunStatsCard
          status={status}
          {...(metrics ? { metrics } : {})}
        />
      </section>
    </div>
  );
}

