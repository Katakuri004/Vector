"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type CardItem = {
  quote: string;
  name: string;
  title: string;
};

type Direction = "left" | "right";

type Speed = "fast" | "normal" | "slow";

interface InfiniteMovingCardsProps {
  readonly items: CardItem[];
  readonly direction?: Direction;
  readonly speed?: Speed;
  readonly pauseOnHover?: boolean;
  readonly className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicated = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicated);
    });

    const duration = speed === "fast" ? "20s" : speed === "slow" ? "80s" : "40s";
    containerRef.current.style.animationDuration = duration;
    containerRef.current.style.animationDirection = direction === "left" ? "normal" : "reverse";

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            key={`${item.name}-${item.title}`}
            className="relative w-[320px] max-w-full shrink-0 rounded-2xl border border-border bg-card px-6 py-6 md:w-[420px]"
          >
            <blockquote>
              <span className="relative z-10 text-sm font-normal leading-relaxed text-card-foreground">
                {item.quote}
              </span>
              <div className="relative z-10 mt-6 flex flex-col">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{item.title}</span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
