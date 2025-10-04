from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.models import Regions
from epidemic_sim.core.utils import orm_to_dict
from epidemic_sim.schemas.dto import Region


async def list_regions(session: AsyncSession, dataset_id: str) -> list[Region]:
    stmt = select(Regions).where(Regions.dataset_id == dataset_id)
    result = await session.execute(stmt)
    return [Region.model_validate(orm_to_dict(row)) for row in result.scalars().all()]
