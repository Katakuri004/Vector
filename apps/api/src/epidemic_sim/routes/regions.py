from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.db import get_session
from epidemic_sim.core.security import AuthContext, resolve_auth
from epidemic_sim.schemas.dto import PaginatedResponse
from epidemic_sim.services import datasets as dataset_service
from epidemic_sim.services import regions as region_service

router = APIRouter(prefix="/regions", tags=["regions"])


@router.get("", response_model=PaginatedResponse)
async def list_regions(
    dataset_id: str,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> PaginatedResponse:
    dataset = await dataset_service.list_datasets(session, auth.sub)
    if dataset_id not in {item.id for item in dataset}:
        raise HTTPException(status_code=404, detail="Dataset not found")
    regions = await region_service.list_regions(session, dataset_id)
    return PaginatedResponse(items=[region.model_dump() for region in regions], next_cursor=None)
