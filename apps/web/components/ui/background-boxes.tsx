"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const TOKEN_PALETTE = [
  "var(--primary)",
  "var(--accent)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const randomTokenColor = () => TOKEN_PALETTE[Math.floor(Math.random() * TOKEN_PALETTE.length)];

export function BackgroundBoxes({ className, ...props }: { className?: string }) {
  const rows = new Array(120).fill(0);
  const cols = new Array(80).fill(0);

  return (
    <div
      style={{
        transform:
          "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...props}
    >
      {rows.map((_, rowIndex) => (
        <motion.div key={`row-${rowIndex}`} className="relative h-6 w-12 border-l border-border/50">
          {cols.map((_, colIndex) => (
            <motion.div
              key={`cell-${rowIndex}-${colIndex}`}
              whileHover={{ backgroundColor: randomTokenColor(), transition: { duration: 0 } }}
              animate={{ transition: { duration: 2 } }}
              className="relative h-6 w-12 border-t border-r border-border/40"
            >
              {colIndex % 2 === 0 && rowIndex % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="var(--border)"
                  className="pointer-events-none absolute -top-[10px] -left-[18px] h-5 w-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
