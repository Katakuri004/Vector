from __future__ import annotations

from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException

from epidemic_sim.config.settings import get_settings
from epidemic_sim.core import logging as logging_config
from epidemic_sim.core.db import init_engine
from epidemic_sim.core.errors import (
    ApiError,
    http_exception_handler,
    problem_exception_handler,
    unhandled_exception_handler,
)
from epidemic_sim.routes import datasets, health, regions, runs, scenarios, stream

settings = get_settings()
logging_config.configure_logging(settings.environment)

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.2)


@asynccontextmanager
def lifespan(app: FastAPI):
    init_engine()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Epidemic Simulation API",
        version="0.1.0",
        description="Backend for the epidemic simulation platform.",
        docs_url=f"{settings.api_prefix}/docs",
        redoc_url=f"{settings.api_prefix}/redoc",
        lifespan=lifespan,
    )

    api_router = APIRouter()
    api_router.include_router(health.router)
    api_router.include_router(datasets.router)
    api_router.include_router(regions.router)
    api_router.include_router(runs.router)
    api_router.include_router(scenarios.router)
    api_router.include_router(stream.router)
    app.include_router(api_router, prefix=settings.api_prefix)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

    app.add_exception_handler(ApiError, problem_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    FastAPIInstrumentor.instrument_app(app)
    instrumentator = Instrumentator()
    instrumentator.instrument(app)
    instrumentator.expose(
        app,
        include_in_schema=False,
        endpoint=f"{settings.api_prefix}/metrics",
    )

    return app


app = create_app()
