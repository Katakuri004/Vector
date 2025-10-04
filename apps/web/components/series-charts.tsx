"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface SeriesPoint {
  readonly t: number;
  readonly [key: string]: number;
}

interface SeriesChartsProps {
  readonly data: readonly SeriesPoint[];
  readonly metrics: readonly string[];
  readonly height?: number;
}

const paletteTokens = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"] as const;

// Recharts expects hex colors; convert design token RGB to hex at runtime.
const tokenColor = (token: string): string => {
  if (typeof window === "undefined") {
    return "#FFFFFF";
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(raw);
  if (!match) {
    return "#FFFFFF";
  }
  const [, r, g, b] = match;
  const toHex = (component: string) => Number.parseInt(component, 10).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export function SeriesCharts({ data, metrics, height = 280 }: SeriesChartsProps) {
  const safeMetrics = metrics.filter((metric) => /^[A-Za-z0-9_]+$/.test(metric));
  const seriesWithColor = safeMetrics
    .slice(0, paletteTokens.length)
    .map((metric, index) => ({ metric, color: tokenColor(paletteTokens[index]) })); // eslint-disable-line security/detect-object-injection
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data as SeriesPoint[]}>
          <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              color: "var(--card-foreground)",
            }}
          />
          <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
          {seriesWithColor.map((series) => (
            <Line
              key={series.metric}
              type="monotone"
              dataKey={series.metric}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

