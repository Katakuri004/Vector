from __future__ import annotations

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.db import get_session
from epidemic_sim.core.errors import ApiError
from epidemic_sim.core.idempotency import check_idempotency, store_idempotency
from epidemic_sim.core.security import AuthContext, resolve_auth
from epidemic_sim.schemas.dto import PaginatedResponse, Run, RunCreateRequest
from epidemic_sim.services import run_series as run_series_service
from epidemic_sim.services import runs as run_service

router = APIRouter(prefix="/runs", tags=["runs"])


@router.get("", response_model=PaginatedResponse)
async def list_runs(
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> PaginatedResponse:
    runs = await run_service.list_runs(session, auth.sub)
    return PaginatedResponse(items=[run.model_dump() for run in runs], next_cursor=None)


@router.post("", response_model=Run, status_code=202)
async def create_run_endpoint(
    payload: RunCreateRequest,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> Run:
    if idempotency_key:
        cached = await check_idempotency(idempotency_key)
        if cached:
            return Run.model_validate(cached)
    run = await run_service.create_run(session, auth.sub, payload)
    if idempotency_key:
        await store_idempotency(idempotency_key, run.model_dump())
    return run


@router.get("/{run_id}", response_model=Run)
async def get_run(
    run_id: str,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> Run:
    run = await run_service.get_run(session, auth.sub, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@router.get("/{run_id}/frames", response_model=PaginatedResponse)
async def get_run_frames(
    run_id: str,
    cursor: int | None = None,
    limit: int = 100,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> PaginatedResponse:
    run = await run_service.get_run(session, auth.sub, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    frames = await run_series_service.list_frames(session, run_id, limit=limit, cursor=cursor)
    next_cursor = frames[-1].t if frames else None
    return PaginatedResponse(
        items=[frame.model_dump() for frame in frames],
        next_cursor=str(next_cursor) if next_cursor is not None else None,
    )
