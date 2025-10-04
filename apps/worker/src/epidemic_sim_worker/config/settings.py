from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class WorkerSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env",), extra="allow")

    redis_url: str = Field(..., alias="REDIS_URL")
    database_url: str = Field(..., alias="DATABASE_URL")
    otel_exporter_otlp_endpoint: str | None = Field(
        default=None, alias="OTEL_EXPORTER_OTLP_ENDPOINT"
    )
    run_queue_name: str = Field(default="simulation-runs", alias="RUN_QUEUE_NAME")
    batch_size: int = Field(default=24, ge=1, alias="BATCH_SIZE")


@lru_cache(maxsize=1)
def get_settings() -> WorkerSettings:
    return WorkerSettings()
