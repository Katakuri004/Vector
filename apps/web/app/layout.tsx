import "@total-typescript/ts-reset";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Epidemic Simulation Platform",
  description:
    "Design pathogens, orchestrate interventions, and watch live outbreak simulations unfold with actionable dashboards.",
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en" className="bg-background text-foreground">
        <body className="min-h-screen bg-background text-foreground antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
  );
}

