"use client";

interface MobilityUploaderProps {
  readonly onUpload: (file: File) => void;
}

export function MobilityUploader({ onUpload }: MobilityUploaderProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-center">
      <p className="text-sm font-medium text-foreground">Mobility matrix</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Upload a CSV with source_region,destination_region,weight to override defaults.
      </p>
      <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary">
        <input
          type="file"
          accept=".csv"
          className="sr-only"
          onChange={(event) => {
            const [file] = event.target.files ?? [];
            if (file) {
              onUpload(file);
            }
          }}
        />
        Choose CSV
      </label>
    </div>
  );
}

