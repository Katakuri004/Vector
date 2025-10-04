from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from opentelemetry import trace
from opentelemetry.trace import Span


def current_span() -> Span | None:
    tracer = trace.get_tracer(__name__)
    span = trace.get_current_span()
    if span and span.get_span_context().is_valid:
        return span
    return None


def current_trace_id() -> str:
    span = current_span()
    if span:
        return span.get_span_context().trace_id.to_bytes(16, "big").hex()
    return "00000000000000000000000000000000"


@contextmanager
def start_span(name: str) -> Iterator[Span]:
    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span(name) as span:
        yield span
