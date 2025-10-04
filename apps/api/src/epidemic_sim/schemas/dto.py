from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class Pathogen(BaseModel):
    id: str | None = None
    name: str
    beta: float
    sigma: float
    gamma: float
    mu: float
    ifr: float | None = None
    incubation: float | None = None
    seasonality: float | None = None
    noise: float | None = None


class EngineCfg(BaseModel):
    type: Literal["mechanistic", "learned"]
    version: str
    seed: int
    dt: float
    horizon: int


class NpiDefinition(BaseModel):
    id: str
    label: str
    description: str | None = None
    effects: dict[str, float]
    activation_delay_days: int = 0


class NpiTimelineEntry(BaseModel):
    day: int
    active: list[str]


class ScenarioCreateRequest(BaseModel):
    id: str | None = None
    title: str
    region_set: str
    pathogen: Pathogen
    datasets: list[str]
    npi_catalog: list[NpiDefinition]
    npi_timeline: list[NpiTimelineEntry]
    engine: EngineCfg


class Scenario(ScenarioCreateRequest):
    owner_id: str
    id: str


class Dataset(BaseModel):
    id: str
    owner_id: str
    name: str
    type: str
    uri: str
    version: str
    meta: dict[str, Any] | None = None


class Region(BaseModel):
    id: str
    dataset_id: str
    name: str
    geom: dict[str, Any]
    population: int


class Run(BaseModel):
    id: str
    scenario_id: str
    owner_id: str
    engine: EngineCfg
    status: Literal["queued", "running", "completed", "failed", "cancelled"]
    seed: int
    started_at: datetime | None = None
    finished_at: datetime | None = None
    metrics_summary: dict[str, Any] | None = None


class RunCreateRequest(BaseModel):
    scenario_id: str
    engine: EngineCfg
    seed: int


class RunFrameSeriesPoint(BaseModel):
    region_id: str
    S: float
    E: float
    I: float
    R: float
    D: float
    new_cases: float | None = None
    rt: float | None = None


class RunFrame(BaseModel):
    run_id: str
    t: int
    series: list[RunFrameSeriesPoint]
    perf: dict[str, float] | None = None


class PaginatedResponse(BaseModel):
    items: list[Any]
    next_cursor: str | None = Field(default=None, alias="nextCursor")

    model_config = {
        "populate_by_name": True,
        "alias_generator": None,
    }


class ProblemDetail(BaseModel):
    type: str = "about:blank"
    title: str
    status: int
    detail: str | None = None
    instance: str | None = None
    correlationId: str
    code: str
    timestamp: datetime
    errors: dict[str, Any] | None = None
