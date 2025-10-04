"use client";

import { useAuth } from "@clerk/nextjs";

export function useOptionalAuth() {
  try {
    return useAuth();
  } catch {
    return {
      getToken: async () => null,
    } as Pick<ReturnType<typeof useAuth>, "getToken">;
  }
}
