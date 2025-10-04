from __future__ import annotations

import uuid
from datetime import datetime

from rq import Queue
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.models import Runs
from epidemic_sim.core.redis_pool import get_sync_redis
from epidemic_sim.core.utils import orm_to_dict
from epidemic_sim.schemas.dto import EngineCfg, Run, RunCreateRequest

_QUEUE_NAME = "simulation-runs"


def _queue() -> Queue:
    return Queue(name=_QUEUE_NAME, connection=get_sync_redis())


async def list_runs(session: AsyncSession, owner_id: str) -> list[Run]:
    result = await session.execute(select(Runs).where(Runs.owner_id == owner_id))
    return [Run.model_validate(orm_to_dict(row)) for row in result.scalars().all()]


async def create_run(
    session: AsyncSession,
    owner_id: str,
    request: RunCreateRequest,
) -> Run:
    run_id = str(uuid.uuid4())
    record = Runs(
        id=run_id,
        scenario_id=request.scenario_id,
        owner_id=owner_id,
        engine=request.engine.model_dump(),
        status="queued",
        seed=request.seed,
        started_at=None,
        finished_at=None,
        metrics_summary=None,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)

    _queue().enqueue(
        "epidemic_sim_worker.queue.jobs.run_simulation",
        run_payload={
          "run_id": run_id,
          "scenario_id": request.scenario_id,
          "owner_id": owner_id,
          "engine": request.engine.model_dump(),
          "seed": request.seed,
        },
        job_id=run_id,
    )

    return Run.model_validate(orm_to_dict(record))


async def get_run(session: AsyncSession, owner_id: str, run_id: str) -> Run | None:
    result = await session.execute(
        select(Runs).where(Runs.id == run_id, Runs.owner_id == owner_id)
    )
    row = result.scalar_one_or_none()
    if row is None:
        return None
    return Run.model_validate(orm_to_dict(row))


async def update_status(
    session: AsyncSession,
    run_id: str,
    status: str,
    metrics_summary: dict | None = None,
) -> None:
    result = await session.execute(select(Runs).where(Runs.id == run_id))
    run = result.scalar_one_or_none()
    if not run:
        return
    run.status = status
    if status == "running":
        run.started_at = datetime.utcnow()
    if status in {"completed", "failed", "cancelled"}:
        run.finished_at = datetime.utcnow()
    if metrics_summary is not None:
        run.metrics_summary = metrics_summary
    await session.commit()
