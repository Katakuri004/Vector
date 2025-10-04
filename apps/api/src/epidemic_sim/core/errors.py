from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.exceptions import HTTPException as StarletteHTTPException

from epidemic_sim.core.tracing import current_trace_id


class ProblemDetail(BaseModel):
    type: str = Field(default="about:blank")
    title: str
    status: int
    detail: str | None = None
    instance: str | None = None
    correlationId: str = Field(default_factory=current_trace_id)
    code: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    errors: dict[str, Any] | None = None

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }


class ApiError(RuntimeError):
    def __init__(self, *, code: str, title: str, status_code: int, detail: str | None = None):
        super().__init__(detail or title)
        self.problem = ProblemDetail(
            code=code,
            title=title,
            status=status_code,
            detail=detail,
        )


def problem_response(problem: ProblemDetail) -> JSONResponse:
    return JSONResponse(status_code=problem.status, content=problem.model_dump())


async def problem_exception_handler(_: Request, exc: ApiError) -> JSONResponse:
    return problem_response(exc.problem)


async def http_exception_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    problem = ProblemDetail(
        code=f"http.{exc.status_code}",
        title=exc.detail if isinstance(exc.detail, str) else "HTTP Error",
        status=exc.status_code,
        detail=exc.detail if isinstance(exc.detail, str) else None,
    )
    return problem_response(problem)


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    problem = ProblemDetail(
        code="server.unexpected",
        title="Unexpected error",
        detail=str(exc),
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
    return problem_response(problem)
