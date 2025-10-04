import type { EngineCfg } from './scenario';
import { z } from 'zod';

export const idSchema = z.string().uuid();

export const problemErrorSchema = z.object({
  type: z.string().url(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  correlationId: z.string(),
  code: z.string(),
  timestamp: z.string(),
});

export type ProblemError = z.infer<typeof problemErrorSchema>;

export type PaginatedResponse<T> = {
  items: T[];
  nextCursor?: string | null;
};

export type Dataset = {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  uri: string;
  version: string;
  meta?: Record<string, unknown> | null;
};

export type Region = {
  id: string;
  dataset_id: string;
  name: string;
  geom: Record<string, unknown>;
  population: number;
};

export type Run = {
  id: string;
  scenario_id: string;
  owner_id: string;
  engine: EngineCfg;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  seed: number;
  started_at?: string | null;
  finished_at?: string | null;
  metrics_summary?: Record<string, unknown> | null;
};

export type RunCreateRequest = {
  scenario_id: string;
  engine: EngineCfg;
  seed: number;
};
