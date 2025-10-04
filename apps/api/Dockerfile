# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY apps/api/pyproject.toml ./pyproject.toml
COPY apps/api/src ./src
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -e .[dev]
COPY apps/api/tests ./tests
ENV PYTHONPATH=/app/src
EXPOSE 8000
CMD ["uvicorn", "epidemic_sim.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
