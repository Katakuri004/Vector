import { create } from "zustand";
import type {
  EngineCfg,
  Pathogen,
  ScenarioCreateRequest,
} from "@epidemic-sim/shared-schemas";

interface SimulationRun {
  readonly id: string;
  readonly status: ScenarioRunStatus;
  readonly metrics?: Record<string, number>;
}

type ScenarioRunStatus = "idle" | "queued" | "running" | "completed" | "failed" | "cancelled";

interface SimulationState {
  readonly scenarioDraft: ScenarioCreateRequest;
  readonly runs: SimulationRun[];
  readonly activeRunId: string | null;
  setScenarioDraft: (updater: (draft: ScenarioCreateRequest) => ScenarioCreateRequest) => void;
  setActiveRun: (runId: string | null) => void;
  upsertRun: (run: SimulationRun) => void;
  resetScenario: () => void;
}

const defaultEngine: EngineCfg = {
  type: "mechanistic",
  version: "v1",
  seed: 42,
  dt: 1,
  horizon: 180,
};

const defaultPathogen: Pathogen = {
  id: undefined,
  name: "Custom pathogen",
  beta: 0.28,
  sigma: 0.2,
  gamma: 0.1,
  mu: 0.01,
};

const baseScenario: ScenarioCreateRequest = {
  id: undefined,
  title: "New scenario",
  region_set: "global",
  pathogen: defaultPathogen,
  datasets: [],
  npi_catalog: [],
  npi_timeline: [],
  engine: defaultEngine,
};

const cloneScenario = (scenario: ScenarioCreateRequest): ScenarioCreateRequest => ({
  ...scenario,
  pathogen: { ...scenario.pathogen },
  datasets: [...scenario.datasets],
  npi_catalog: [...scenario.npi_catalog],
  npi_timeline: [...scenario.npi_timeline],
  engine: { ...scenario.engine },
});

export const useSimulationStore = create<SimulationState>((set) => ({
  scenarioDraft: cloneScenario(baseScenario),
  runs: [],
  activeRunId: null,
  setScenarioDraft: (updater) =>
    set((state) => ({
      scenarioDraft: cloneScenario(updater(cloneScenario(state.scenarioDraft))),
    })),
  setActiveRun: (runId) => set({ activeRunId: runId }),
  upsertRun: (run) =>
    set((state) => {
      const existingIndex = state.runs.findIndex((item) => item.id === run.id);
      if (existingIndex !== -1) {
        const updated = state.runs.map((item, idx) => (idx === existingIndex ? run : item));
        return { runs: updated };
      }
      return { runs: [run, ...state.runs] };
    }),
  resetScenario: () => set({ scenarioDraft: cloneScenario(baseScenario), runs: [], activeRunId: null }),
}));

