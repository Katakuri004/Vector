import type {
  Dataset,
  PaginatedResponse,
  ProblemError,
  Run,
  RunCreateRequest,
  Scenario,
  ScenarioCreateRequest,
} from "@epidemic-sim/shared-schemas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = (await response.json()) as ProblemError;
    const error = new Error(problem.title ?? "Request failed");
    (error as Error & { problem?: ProblemError }).problem = problem;
    throw error;
  }
  return (await response.json()) as T;
}

export async function listDatasets(token: string): Promise<PaginatedResponse<Dataset>> {
  const response = await fetch(`${API_BASE_URL}/datasets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  return handleResponse<PaginatedResponse<Dataset>>(response);
}

export async function createScenario(
  token: string,
  payload: ScenarioCreateRequest,
): Promise<Scenario> {
  const response = await fetch(`${API_BASE_URL}/scenarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Scenario>(response);
}

export async function createRun(token: string, payload: RunCreateRequest): Promise<Run> {
  const response = await fetch(`${API_BASE_URL}/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Run>(response);
}

export function openRunStream(
  token: string,
  runId: string,
  onMessage: (frame: unknown) => void,
): () => void {
  const controller = new AbortController();
  const url = `${API_BASE_URL}/runs/${runId}/stream?token=${encodeURIComponent(token)}`;
  const eventSource = new EventSource(url, { withCredentials: false });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error("stream.parse", error);
    }
  };
  eventSource.onerror = (error) => {
    console.error("stream.error", error);
    eventSource.close();
  };

  controller.signal.addEventListener("abort", () => {
    eventSource.close();
  });

  return () => controller.abort();
}

