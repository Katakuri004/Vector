from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, mapped_column, relationship

Base = declarative_base()


class Runs(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True)
    scenario_id = Column(String, nullable=False)
    owner_id = Column(String, nullable=False)
    engine = Column(JSONB, nullable=False)
    status = Column(String, nullable=False)
    seed = Column(Integer, nullable=False)
    started_at = Column(DateTime)
    finished_at = Column(DateTime)
    metrics_summary = Column(JSONB)


class RunSeries(Base):
    __tablename__ = "run_series"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String, ForeignKey("runs.id"), index=True, nullable=False)
    t = Column(Integer, nullable=False)
    region_id = Column(String, nullable=False)
    S = Column(Float, nullable=False)
    E = Column(Float, nullable=False)
    I = Column(Float, nullable=False)
    R = Column(Float, nullable=False)
    D = Column(Float, nullable=False)
    new_cases = Column(Float)
    rt = Column(Float)
    policy_state = Column(JSON)


class Regions(Base):
    __tablename__ = "regions"

    id = Column(String, primary_key=True)
    dataset_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    geom = Column(JSONB, nullable=False)
    population = Column(Integer, nullable=False)


class Scenarios(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True)
    owner_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    region_set = Column(String, nullable=False)
    pathogen_id = Column(String, nullable=False)
    datasets = Column(JSONB, nullable=False)
    npi_catalog = Column(JSONB, nullable=False)
    npi_timeline = Column(JSONB, nullable=False)
    engine = Column(JSONB, nullable=False)


class Pathogens(Base):
    __tablename__ = "pathogens"

    id = Column(String, primary_key=True)
    owner_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    params = Column(JSONB, nullable=False)
