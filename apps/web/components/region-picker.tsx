"use client";

interface RegionOption {
  readonly id: string;
  readonly name: string;
}

interface RegionPickerProps {
  readonly options: readonly RegionOption[];
  readonly selected: readonly string[];
  readonly onToggle: (id: string) => void;
}

export function RegionPicker({ options, selected, onToggle }: RegionPickerProps) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">Import a dataset to choose regions.</p>;
  }

  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {options.map((option) => {
        const isActive = selected.includes(option.id);
        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onToggle(option.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-sm)]"
                  : "border-border bg-card text-card-foreground"
              }`}
            >
              <span>{option.name}</span>
              <span className="text-xs text-muted-foreground">{isActive ? "Selected" : "Tap to add"}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

