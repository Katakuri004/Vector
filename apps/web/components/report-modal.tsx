"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

interface ReportModalProps {
  readonly triggerLabel: string;
  readonly children: ReactNode;
}

export function ReportModal({ triggerLabel, children }: ReportModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60">
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lg)] focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-card-foreground">
            Simulation report
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Export charts, intervention logs, and resource forecasts.
          </Dialog.Description>
          <div className="mt-4 max-h-[60vh] overflow-y-auto text-sm text-card-foreground">{children}</div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

