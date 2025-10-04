from __future__ import annotations

from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from epidemic_sim_worker.config.settings import get_settings

_engine = None
_session_maker: async_sessionmaker[AsyncSession] | None = None


def init_engine() -> None:
    global _engine, _session_maker
    if _engine is None:
        settings = get_settings()
        _engine = create_async_engine(settings.database_url, pool_pre_ping=True)
        _session_maker = async_sessionmaker(_engine, expire_on_commit=False)


@asynccontextmanager
async def session_scope() -> AsyncSession:
    if _session_maker is None:
        init_engine()
    assert _session_maker is not None
    async with _session_maker() as session:
        yield session
