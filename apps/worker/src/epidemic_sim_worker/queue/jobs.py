from __future__ import annotations

import asyncio
import json
from datetime import datetime
from typing import Any

import numpy as np
import redis.asyncio as redis_async
from rq import get_current_job
from sqlalchemy import select

from epidemic_sim_worker.config.settings import get_settings
from epidemic_sim_worker.db import session_scope
from epidemic_sim_worker.logging import get_logger
from epidemic_sim_worker.models import Pathogens, Regions, RunSeries, Runs, Scenarios
from epidemic_sim_worker.simulation.model import NpiSchedule, SeirdParams, simulate

LOGGER = get_logger(__name__)


def run_simulation(run_payload: dict[str, Any]) -> None:
    asyncio.run(_run_simulation(run_payload))


async def _run_simulation(run_payload: dict[str, Any]) -> None:
    job = get_current_job()
    run_id = run_payload["run_id"]
    LOGGER.info("worker.start", run_id=run_id, job_id=job.id if job else None)
    settings = get_settings()

    async with session_scope() as session:
        await session.execute(
            Runs.__table__.update()
            .where(Runs.id == run_id)
            .values(status="running", started_at=datetime.utcnow())
        )
        await session.commit()

        run = (await session.execute(select(Runs).where(Runs.id == run_id))).scalar_one()
        scenario = (
            await session.execute(select(Scenarios).where(Scenarios.id == run.scenario_id))
        ).scalar_one()
        pathogen = (
            await session.execute(select(Pathogens).where(Pathogens.id == scenario.pathogen_id))
        ).scalar_one()

        dataset_ids = scenario.datasets or []
        dataset_id = dataset_ids[0] if dataset_ids else None
        region_query = select(Regions)
        if dataset_id:
            region_query = region_query.where(Regions.dataset_id == dataset_id)
        regions = (await session.execute(region_query)).scalars().all()

    if not regions:
        LOGGER.warning("worker.no_regions", run_id=run_id)
        populations = np.array([1000.0])
        region_ids = ["default-region"]
    else:
        populations = np.array([region.population for region in regions], dtype=np.float64)
        region_ids = [region.id for region in regions]
        if populations.sum() == 0:
            populations = np.ones_like(populations) * 1_000

    num_regions = populations.shape[0]
    initial_S = populations.copy()
    initial_E = np.zeros(num_regions)
    initial_I = np.full(num_regions, 10.0)
    initial_R = np.zeros(num_regions)
    initial_D = np.zeros(num_regions)
    initial_S -= initial_I

    mobility = np.eye(num_regions) * 0.9
    if num_regions > 1:
        mobility += (np.ones((num_regions, num_regions)) - np.eye(num_regions)) * 0.1 / (
            num_regions - 1
        )

    params = SeirdParams(
        beta=pathogen.params.get("beta", 0.25),
        sigma=pathogen.params.get("sigma", 0.2),
        gamma=pathogen.params.get("gamma", 0.1),
        mu=pathogen.params.get("mu", 0.01),
        dt=run.engine.get("dt", 1.0),
        population=populations,
        mobility=mobility,
    )

    schedule = [
        NpiSchedule(
            day=entry.get("day", 0),
            beta_multiplier=entry.get("betaMultiplier", 0.8),
            mobility_multiplier=entry.get("mobilityMultiplier", 0.9),
        )
        for entry in scenario.npi_timeline
    ]

    frames = simulate(
        {"S": initial_S, "E": initial_E, "I": initial_I, "R": initial_R, "D": initial_D},
        params,
        horizon=run.engine.get("horizon", 180),
        npi_schedule=schedule,
    )

    redis_client = redis_async.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
    channel = f"run:{run_id}:frames"

    async with session_scope() as session:
        await session.execute(RunSeries.__table__.delete().where(RunSeries.run_id == run_id))
        await session.commit()

        total_steps = frames["S"].shape[0]
        for t in range(total_steps):
            batch = []
            for idx, region_id in enumerate(region_ids):
                batch.append(
                    {
                        "run_id": run_id,
                        "t": t,
                        "region_id": region_id,
                        "S": float(frames["S"][t, idx]),
                        "E": float(frames["E"][t, idx]),
                        "I": float(frames["I"][t, idx]),
                        "R": float(frames["R"][t, idx]),
                        "D": float(frames["D"][t, idx]),
                        "new_cases": float(
                            frames["I"][t, idx] - frames["I"][max(t - 1, 0), idx]
                        )
                        if t > 0
                        else float(frames["I"][t, idx]),
                        "rt": float(params.beta / params.gamma) if params.gamma > 0 else 0.0,
                        "policy_state": None,
                    }
                )
            await session.execute(RunSeries.__table__.insert(), batch)
            await session.commit()

            payload = {
                "runId": run_id,
                "t": t,
                "series": [
                    {
                        "regionId": item["region_id"],
                        "S": item["S"],
                        "E": item["E"],
                        "I": item["I"],
                        "R": item["R"],
                        "D": item["D"],
                        "newCases": item["new_cases"],
                        "rt": item["rt"],
                    }
                    for item in batch
                ],
                "perf": {"stepsPerSecond": 0.0},
            }
            await redis_client.publish(channel, json.dumps(payload))

        await session.execute(
            Runs.__table__.update()
            .where(Runs.id == run_id)
            .values(
                status="completed",
                finished_at=datetime.utcnow(),
                metrics_summary={
                    "peakInfected": float(frames["I"].max()),
                    "totalDeaths": float(frames["D"].sum(axis=1)[-1]),
                },
            )
        )
        await session.commit()

    await redis_client.aclose()
    LOGGER.info("worker.complete", run_id=run_id)
