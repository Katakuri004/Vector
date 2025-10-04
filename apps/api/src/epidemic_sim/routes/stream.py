from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sse_starlette.sse import EventSourceResponse

from epidemic_sim.core.redis_pool import get_redis
from epidemic_sim.core.security import AuthContext, resolve_auth
from epidemic_sim.services import runs as run_service
from epidemic_sim.core.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/runs", tags=["run-stream"])


@router.get("/{run_id}/stream")
async def stream_run_frames(
    run_id: str,
    auth: AuthContext = Depends(resolve_auth),
    session: AsyncSession = Depends(get_session),
) -> EventSourceResponse:
    run = await run_service.get_run(session, auth.sub, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    redis = get_redis()
    pubsub = redis.pubsub()
    channel = f"run:{run_id}:frames"
    await pubsub.subscribe(channel)

    async def event_generator():
        try:
            async for message in pubsub.listen():
                if message["type"] != "message":
                    continue
                data = message["data"]
                yield {
                    "event": "frame",
                    "data": data if isinstance(data, str) else json.dumps(data),
                }
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()

    return EventSourceResponse(event_generator())
