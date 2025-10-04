from __future__ import annotations

import json

from epidemic_sim.config.settings import get_settings
from epidemic_sim.core.logging import get_logger
from epidemic_sim.core.redis_pool import get_redis

_logger = get_logger(__name__)

_KEY_PREFIX = "idempotency:"


def _key(key: str) -> str:
    return f"{_KEY_PREFIX}{key}"


async def check_idempotency(key: str) -> dict[str, str] | None:
    client = get_redis()
    value = await client.get(_key(key))
    if value:
        _logger.info("idempotency.hit", key=key)
        return json.loads(value)
    return None


async def store_idempotency(key: str, payload: dict[str, str]) -> None:
    client = get_redis()
    ttl_seconds = get_settings().idempotency_ttl_seconds
    await client.set(_key(key), json.dumps(payload), ex=ttl_seconds)
    _logger.info("idempotency.store", key=key, ttl=ttl_seconds)
