"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { label: "Overview", hash: "overview" },
  { label: "Simulation", hash: "simulation" },
  { label: "Dashboards", hash: "dashboards" },
  { label: "Reports", hash: "reports" },
  { label: "Integrations", hash: "integrations" },
];

export function AppSidebar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const renderNavLinks = (onClick?: () => void) => (
    <ul className="flex flex-col gap-2">
      {NAV_ITEMS.map((item) => (
        <li key={item.label}>
          <Link
            href={{ pathname: "/", hash: item.hash }}
            onClick={() => onClick?.()}
            className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:text-foreground"
          >
            {item.label}
            <span className="text-xs text-muted-foreground/70">↘</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className={cn("relative z-20", className)}>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-sm)] lg:hidden">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Vector</span>
          <span className="text-lg font-semibold text-foreground">Command Center</span>
        </div>
        <button
          type="button"
          className="rounded-full border border-border px-3 py-2 text-sm text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-md)] lg:hidden"
          >
            {renderNavLinks(() => setOpen(false))}
            <div className="mt-4 border-t border-border/60 pt-4">
              <ThemeToggle />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <aside className="hidden min-h-[calc(100vh-4rem)] w-64 flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-md)] lg:flex">
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Vector</span>
            <h1 className="text-2xl font-semibold text-foreground">Mission Control</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Configure outbreaks, monitor KPIs, and orchestrate interventions in real time.
            </p>
          </div>
          {renderNavLinks()}
        </div>
        <div className="rounded-2xl border border-border/60 bg-background px-3 py-4">
          <ThemeToggle />
        </div>
      </aside>
    </nav>
  );
}
