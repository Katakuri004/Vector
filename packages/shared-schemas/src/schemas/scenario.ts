import { z } from 'zod';
import { pathogenSchema } from './pathogen';

export const engineSchema = z.object({
  type: z.enum(['mechanistic', 'learned']),
  version: z.string(),
  seed: z.number().int().nonnegative(),
  dt: z.number().positive(),
  horizon: z.number().int().positive(),
});

export const npiSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  effects: z.record(z.string(), z.number()),
  activation_delay_days: z.number().int().nonnegative().default(0),
});

export const npiTimelineEntrySchema = z.object({
  day: z.number().int().nonnegative(),
  active: z.array(z.string()),
});

export const scenarioCreateSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  region_set: z.string(),
  pathogen: pathogenSchema,
  datasets: z.array(z.string().uuid()),
  npi_catalog: z.array(npiSchema),
  npi_timeline: z.array(npiTimelineEntrySchema),
  engine: engineSchema,
});

export const scenarioSchema = scenarioCreateSchema.extend({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
});

export type ScenarioCreateRequest = z.infer<typeof scenarioCreateSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type NpiDefinition = z.infer<typeof npiSchema>;
export type NpiTimelineEntry = z.infer<typeof npiTimelineEntrySchema>;
export type EngineCfg = z.infer<typeof engineSchema>;
