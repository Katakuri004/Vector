"use client";

import { useState } from "react";

interface ShareLinkProps {
  readonly url: string;
}

export function ShareLink({ url }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
    >
      {copied ? "Link copied" : "Copy share link"}
    </button>
  );
}

