from __future__ import annotations

import redis.asyncio as redis_async
import redis

from epidemic_sim.config.settings import get_settings

_async_client: redis_async.Redis | None = None
_sync_client: redis.Redis | None = None


def get_redis() -> redis_async.Redis:
    global _async_client
    if _async_client is None:
        settings = get_settings()
        _async_client = redis_async.from_url(
            str(settings.redis_url), encoding="utf-8", decode_responses=True
        )
    return _async_client


def get_sync_redis() -> redis.Redis:
    global _sync_client
    if _sync_client is None:
        settings = get_settings()
        _sync_client = redis.Redis.from_url(str(settings.redis_url))
    return _sync_client
