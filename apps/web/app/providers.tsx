"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import type { ReactNode } from "react";

interface ProvidersProps {
  readonly children: ReactNode;
}

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  if (!publishableKey) {
    return (
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

