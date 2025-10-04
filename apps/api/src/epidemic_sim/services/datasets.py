from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.models import Datasets
from epidemic_sim.core.utils import orm_to_dict
from epidemic_sim.schemas.dto import Dataset


async def list_datasets(session: AsyncSession, owner_id: str) -> list[Dataset]:
    result = await session.execute(select(Datasets).where(Datasets.owner_id == owner_id))
    rows = result.scalars().all()
    return [Dataset.model_validate(orm_to_dict(row)) for row in rows]


async def create_dataset(session: AsyncSession, payload: Dataset) -> Dataset:
    data = payload.model_dump()
    if not data.get("id"):
        data["id"] = str(uuid.uuid4())
    record = Datasets(**data)
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return Dataset.model_validate(orm_to_dict(record))
