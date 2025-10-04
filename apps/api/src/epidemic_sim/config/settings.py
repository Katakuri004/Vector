from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, Field, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_allowed_origins() -> list[str]:
    return ["http://localhost:3000", "https://localhost:3000"]


class ApiSettings(BaseSettings):
    """Runtime configuration sourced from environment variables."""

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), extra="allow")

    environment: Literal["development", "staging", "production"] = Field(
        default="development", description="Deployment environment name."
    )
    database_url: str = Field(..., alias="DATABASE_URL")
    redis_url: AnyUrl = Field(..., alias="REDIS_URL")
    supabase_service_role_key: str = Field(..., alias="SUPABASE_SERVICE_ROLE_KEY")
    clerk_jwks_url: HttpUrl = Field(..., alias="CLERK_JWKS_URL")
    sentry_dsn: HttpUrl | None = Field(default=None, alias="SENTRY_DSN")
    otel_exporter_otlp_endpoint: str | None = Field(
        default=None, alias="OTEL_EXPORTER_OTLP_ENDPOINT"
    )
    api_prefix: str = Field(default="/v1", alias="API_PREFIX")
    cors_allowed_origins: list[str] = Field(
        default_factory=_default_allowed_origins, alias="CORS_ALLOWED_ORIGINS"
    )
    rate_limit_per_minute: int = Field(default=120, ge=1, alias="RATE_LIMIT_PER_MINUTE")
    idempotency_ttl_seconds: int = Field(default=3600, ge=1, alias="IDEMPOTENCY_TTL_SECONDS")
    run_frame_stream_buffer: int = Field(default=256, ge=1, alias="RUN_FRAME_STREAM_BUFFER")


@lru_cache(maxsize=1)
def get_settings() -> ApiSettings:
    """Return cached settings instance."""

    return ApiSettings()
