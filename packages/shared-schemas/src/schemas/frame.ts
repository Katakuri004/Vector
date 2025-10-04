import { z } from 'zod';

export const timeSeriesPointSchema = z.object({
  regionId: z.string().uuid(),
  S: z.number().nonnegative(),
  E: z.number().nonnegative(),
  I: z.number().nonnegative(),
  R: z.number().nonnegative(),
  D: z.number().nonnegative(),
  newCases: z.number().nonnegative().optional(),
  rt: z.number().nonnegative().optional(),
});

export const frameSchema = z.object({
  runId: z.string().uuid(),
  t: z.number().int().nonnegative(),
  series: z.array(timeSeriesPointSchema),
  perf: z
    .object({
      stepsPerSecond: z.number().positive(),
      frameLatencyMs: z.number().nonnegative().optional(),
    })
    .optional(),
});

export type Frame = z.infer<typeof frameSchema>;
