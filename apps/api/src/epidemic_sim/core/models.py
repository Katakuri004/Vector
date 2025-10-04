from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, MetaData, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

metadata = MetaData(schema="public")
Base = declarative_base(metadata=metadata)


class Users(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    display_name: Mapped[str | None]
    plan: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Datasets(Base):
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    uri: Mapped[str] = mapped_column(String)
    version: Mapped[str] = mapped_column(String)
    meta: Mapped[dict[str, Any] | None] = mapped_column(JSONB)


class Regions(Base):
    __tablename__ = "regions"
    __table_args__ = (UniqueConstraint("dataset_id", "name", name="uq_regions_dataset_name"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    dataset_id: Mapped[str] = mapped_column(ForeignKey("datasets.id"))
    name: Mapped[str] = mapped_column(String)
    geom: Mapped[dict[str, Any]] = mapped_column(JSONB)
    population: Mapped[int] = mapped_column(Integer)


class MobilityEdges(Base):
    __tablename__ = "mobility_edges"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    dataset_id: Mapped[str] = mapped_column(ForeignKey("datasets.id"))
    src_region_id: Mapped[str] = mapped_column(ForeignKey("regions.id"))
    dst_region_id: Mapped[str] = mapped_column(ForeignKey("regions.id"))
    weight: Mapped[float] = mapped_column()


class Pathogens(Base):
    __tablename__ = "pathogens"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String)
    params: Mapped[dict[str, Any]] = mapped_column(JSONB)


class Scenarios(Base):
    __tablename__ = "scenarios"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String)
    region_set: Mapped[str] = mapped_column(String)
    pathogen_id: Mapped[str] = mapped_column(ForeignKey("pathogens.id"))
    datasets: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)
    npi_catalog: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)


class Runs(Base):
    __tablename__ = "runs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    scenario_id: Mapped[str] = mapped_column(ForeignKey("scenarios.id"))
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    engine: Mapped[dict[str, Any]] = mapped_column(JSONB)
    status: Mapped[str] = mapped_column(String)
    seed: Mapped[int] = mapped_column(Integer)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)
    metrics_summary: Mapped[dict[str, Any] | None] = mapped_column(JSONB)


class RunSeries(Base):
    __tablename__ = "run_series"
    __table_args__ = (UniqueConstraint("run_id", "t", "region_id", name="uq_run_series"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_id: Mapped[str] = mapped_column(ForeignKey("runs.id"))
    t: Mapped[int] = mapped_column(Integer)
    region_id: Mapped[str] = mapped_column(ForeignKey("regions.id"))
    S: Mapped[float] = mapped_column()
    E: Mapped[float] = mapped_column()
    I: Mapped[float] = mapped_column()
    R: Mapped[float] = mapped_column()
    D: Mapped[float] = mapped_column()
    new_cases: Mapped[float | None] = mapped_column()
    rt: Mapped[float | None] = mapped_column()
    policy_state: Mapped[dict[str, Any] | None] = mapped_column(JSONB)


class Artifacts(Base):
    __tablename__ = "artifacts"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    run_id: Mapped[str] = mapped_column(ForeignKey("runs.id"))
    kind: Mapped[str] = mapped_column(String)
    storage_path: Mapped[str] = mapped_column(String)
    bytes: Mapped[int] = mapped_column(Integer)
