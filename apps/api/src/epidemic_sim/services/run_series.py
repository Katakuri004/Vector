from __future__ import annotations

from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from epidemic_sim.core.models import RunSeries
from epidemic_sim.schemas.dto import RunFrame, RunFrameSeriesPoint


async def list_frames(
    session: AsyncSession, run_id: str, limit: int = 100, cursor: int | None = None
) -> list[RunFrame]:
    stmt = select(RunSeries).where(RunSeries.run_id == run_id).order_by(RunSeries.t.asc())
    if cursor is not None:
        stmt = stmt.where(RunSeries.t > cursor)
    stmt = stmt.limit(limit)
    result = await session.execute(stmt)
    rows = result.scalars().all()

    grouped: dict[int, list[RunFrameSeriesPoint]] = defaultdict(list)
    for row in rows:
        grouped[row.t].append(
            RunFrameSeriesPoint(
                region_id=row.region_id,
                S=row.S,
                E=row.E,
                I=row.I,
                R=row.R,
                D=row.D,
                new_cases=row.new_cases,
                rt=row.rt,
            )
        )
    frames = [
        RunFrame(run_id=run_id, t=t, series=series, perf=None)
        for t, series in sorted(grouped.items())
    ]
    return frames
