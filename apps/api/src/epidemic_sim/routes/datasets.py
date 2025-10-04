from __future__ import annotations

from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.db import get_session
from epidemic_sim.core.security import AuthContext, resolve_auth
from epidemic_sim.schemas.dto import Dataset, PaginatedResponse
from epidemic_sim.services import datasets as dataset_service

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.get("", response_model=PaginatedResponse)
async def get_datasets(
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> PaginatedResponse:
    records = await dataset_service.list_datasets(session, auth.sub)
    return PaginatedResponse(items=[record.model_dump() for record in records], next_cursor=None)


@router.post("", response_model=Dataset, status_code=201)
async def create_dataset_endpoint(
    payload: Dataset,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> Dataset:
    dataset = payload.model_copy(update={"owner_id": auth.sub})
    created = await dataset_service.create_dataset(session, dataset)
    return created
