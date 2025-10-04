# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY apps/worker/pyproject.toml ./pyproject.toml
COPY apps/worker/src ./src
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -e .[dev]
COPY apps/worker/tests ./tests
ENV PYTHONPATH=/app/src
CMD ["python", "-m", "epidemic_sim_worker.runner"]
