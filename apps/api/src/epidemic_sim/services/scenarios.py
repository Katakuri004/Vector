from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.models import Pathogens, Scenarios
from epidemic_sim.schemas.dto import (
    EngineCfg,
    NpiDefinition,
    NpiTimelineEntry,
    Pathogen,
    Scenario,
    ScenarioCreateRequest,
)


def _row_to_pathogen(row: Pathogens) -> Pathogen:
    return Pathogen(
        id=row.id,
        name=row.name,
        beta=row.params.get("beta", 0.0),
        sigma=row.params.get("sigma", 0.0),
        gamma=row.params.get("gamma", 0.0),
        mu=row.params.get("mu", 0.0),
        ifr=row.params.get("ifr"),
        incubation=row.params.get("incubation"),
        seasonality=row.params.get("seasonality"),
        noise=row.params.get("noise"),
    )


async def upsert_pathogen(session: AsyncSession, owner_id: str, payload: Pathogen) -> Pathogen:
    pathogen_id = payload.id or str(uuid.uuid4())
    record = await session.get(Pathogens, pathogen_id)
    params = payload.model_dump(exclude={"id", "name"})
    if record:
        record.name = payload.name
        record.params = params
    else:
        record = Pathogens(id=pathogen_id, owner_id=owner_id, name=payload.name, params=params)
        session.add(record)
    await session.commit()
    await session.refresh(record)
    return _row_to_pathogen(record)


async def create_scenario(
    session: AsyncSession,
    owner_id: str,
    payload: ScenarioCreateRequest,
) -> Scenario:
    pathogen = await upsert_pathogen(session, owner_id, payload.pathogen)
    scenario_id = payload.id or str(uuid.uuid4())
    record = Scenarios(
        id=scenario_id,
        owner_id=owner_id,
        title=payload.title,
        region_set=payload.region_set,
        pathogen_id=pathogen.id,
        datasets=payload.datasets,
        npi_catalog=[npi.model_dump() for npi in payload.npi_catalog],
        npi_timeline=[entry.model_dump() for entry in payload.npi_timeline],
        engine=payload.engine.model_dump(),
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return Scenario(
        id=record.id,
        owner_id=owner_id,
        title=record.title,
        region_set=record.region_set,
        pathogen=pathogen,
        datasets=record.datasets,
        npi_catalog=payload.npi_catalog,
        npi_timeline=payload.npi_timeline,
        engine=payload.engine,
    )


async def list_scenarios(session: AsyncSession, owner_id: str) -> list[Scenario]:
    stmt = select(Scenarios, Pathogens).join(Pathogens, Scenarios.pathogen_id == Pathogens.id)
    stmt = stmt.where(Scenarios.owner_id == owner_id)
    result = await session.execute(stmt)
    scenarios: list[Scenario] = []
    for scenario_row, pathogen_row in result.all():
        scenarios.append(
            Scenario(
                id=scenario_row.id,
                owner_id=owner_id,
                title=scenario_row.title,
                region_set=scenario_row.region_set,
                pathogen=_row_to_pathogen(pathogen_row),
                datasets=scenario_row.datasets,
                npi_catalog=[NpiDefinition.model_validate(catalog) for catalog in scenario_row.npi_catalog],
                npi_timeline=[
                    NpiTimelineEntry.model_validate(entry) for entry in scenario_row.npi_timeline
                ],
                engine=EngineCfg.model_validate(scenario_row.engine),
            )
        )
    return scenarios


async def get_scenario(session: AsyncSession, owner_id: str, scenario_id: str) -> Scenario | None:
    stmt = (
        select(Scenarios, Pathogens)
        .join(Pathogens, Scenarios.pathogen_id == Pathogens.id)
        .where(Scenarios.owner_id == owner_id, Scenarios.id == scenario_id)
    )
    result = await session.execute(stmt)
    row = result.first()
    if not row:
        return None
    scenario_row, pathogen_row = row
    return Scenario(
        id=scenario_row.id,
        owner_id=owner_id,
        title=scenario_row.title,
        region_set=scenario_row.region_set,
        pathogen=_row_to_pathogen(pathogen_row),
        datasets=scenario_row.datasets,
        npi_catalog=[NpiDefinition.model_validate(catalog) for catalog in scenario_row.npi_catalog],
        npi_timeline=[
            NpiTimelineEntry.model_validate(entry) for entry in scenario_row.npi_timeline
        ],
        engine=EngineCfg.model_validate(scenario_row.engine),
    )
