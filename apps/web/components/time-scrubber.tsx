"use client";

import { useMemo } from "react";

interface TimeScrubberProps {
  readonly currentStep: number;
  readonly maxStep: number;
  readonly onChange: (value: number) => void;
}

export function TimeScrubber({ currentStep, maxStep, onChange }: TimeScrubberProps) {
  const marks = useMemo(() => Array.from({ length: 5 }, (_, index) => Math.round((index / 4) * maxStep)), [maxStep]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>t = {currentStep}</span>
        <span>horizon {maxStep}</span>
      </div>
      <input
        aria-label="Simulation time step"
        type="range"
        min={0}
        max={maxStep}
        value={currentStep}
        onChange={(event) => onChange(Number.parseInt(event.target.value, 10))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {marks.map((mark) => (
          <span key={mark}>{mark}</span>
        ))}
      </div>
    </div>
  );
}

