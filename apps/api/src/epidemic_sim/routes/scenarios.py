from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.db import get_session
from epidemic_sim.core.security import AuthContext, resolve_auth
from epidemic_sim.schemas.dto import PaginatedResponse, Scenario, ScenarioCreateRequest
from epidemic_sim.services import scenarios as scenario_service

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


@router.get("", response_model=PaginatedResponse)
async def list_scenarios(
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> PaginatedResponse:
    scenarios = await scenario_service.list_scenarios(session, auth.sub)
    return PaginatedResponse(
        items=[scenario.model_dump() for scenario in scenarios], next_cursor=None
    )


@router.post("", response_model=Scenario, status_code=201)
async def create_scenario(
    payload: ScenarioCreateRequest,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> Scenario:
    scenario = await scenario_service.create_scenario(session, auth.sub, payload)
    return scenario


@router.get("/{scenario_id}", response_model=Scenario)
async def get_scenario(
    scenario_id: str,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> Scenario:
    scenario = await scenario_service.get_scenario(session, auth.sub, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario
