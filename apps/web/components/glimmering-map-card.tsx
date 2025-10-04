"use client";

import { motion } from "motion/react";

import { BackgroundBoxes } from "@/components/ui/background-boxes";

const pulseNodes = [
  { top: "15%", left: "25%" },
  { top: "45%", left: "60%" },
  { top: "70%", left: "35%" },
  { top: "30%", left: "80%" },
];

export function GlimmeringMapCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lg)]">
      <div className="absolute inset-0 rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top,var(--accent)/0.28,transparent_65%)]" />
      <BackgroundBoxes className="opacity-40 blur-[2px]" />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Live outbreak mesh
        </span>
        <h3 className="mt-4 text-xl font-semibold text-foreground">Glimmering network view</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Observe every seeded case, mobility edge, and policy effect as they ripple across your regions in real time.
        </p>
      </motion.div>
      <div className="relative z-10 mt-6 h-64 rounded-2xl border border-border/50 bg-background/70 backdrop-blur">
        {pulseNodes.map((node, index) => (
          <span
            key={`glimmer-node-${index}`}
            style={{ top: node.top, left: node.left }}
            className="absolute inline-flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_6px_var(--primary)/20]"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
          </span>
        ))}
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-xs text-muted-foreground">
          <div>
            <p className="text-sm font-semibold text-foreground">Next plume</p>
            <p>Projected peak in <span className="text-primary font-medium">3.6 days</span></p>
          </div>
          <div className="text-right">
            <p>Scenario</p>
            <p className="font-semibold text-foreground">Delta Cascade v7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
