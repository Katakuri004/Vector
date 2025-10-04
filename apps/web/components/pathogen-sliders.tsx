"use client";

import type { ChangeEvent } from "react";
import type { Pathogen } from "@epidemic-sim/shared-schemas";

interface PathogenSlidersProps {
  readonly pathogen: Pathogen;
  readonly onChange: (pathogen: Pathogen) => void;
}

const fields: Array<{
  readonly key: keyof Pathogen;
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
}> = [
  { key: "beta", label: "Transmission (ß)", min: 0, max: 1, step: 0.01 },
  { key: "sigma", label: "Incubation rate (s)", min: 0, max: 1, step: 0.01 },
  { key: "gamma", label: "Recovery rate (?)", min: 0, max: 1, step: 0.01 },
  { key: "mu", label: "Fatality rate (µ)", min: 0, max: 0.2, step: 0.005 },
];

export function PathogenSliders({ pathogen, onChange }: PathogenSlidersProps) {
  const handleChange = (key: keyof Pathogen) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value);
    onChange({ ...pathogen, [key]: Number.isNaN(value) ? 0 : value });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
      <header className="space-y-1">
        <h3 className="text-sm font-semibold text-card-foreground">Pathogen parameters</h3>
        <p className="text-xs text-muted-foreground">Tune SEIRD coefficients to explore alternative pathogen behaviours.</p>
      </header>
      <div className="space-y-4">
        {fields.map((field) => (
          <label key={String(field.key)} className="block">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{field.label}</span>
              <span>{pathogen[field.key]}</span>
            </div>
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={pathogen[field.key] ?? 0}
              onChange={handleChange(field.key)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

