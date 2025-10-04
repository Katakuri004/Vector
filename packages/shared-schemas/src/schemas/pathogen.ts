import { z } from 'zod';

export const pathogenSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  beta: z.number().nonnegative(),
  sigma: z.number().nonnegative(),
  gamma: z.number().nonnegative(),
  mu: z.number().nonnegative(),
  ifr: z.number().nonnegative().max(1).optional(),
  incubation: z.number().nonnegative().optional(),
  seasonality: z.number().optional(),
  noise: z.number().nonnegative().optional(),
});

export type Pathogen = z.infer<typeof pathogenSchema>;
