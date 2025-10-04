from __future__ import annotations

from typing import Any

from sqlalchemy.orm import DeclarativeBase


def orm_to_dict(instance: DeclarativeBase) -> dict[str, Any]:
    return {
        key: value
        for key, value in vars(instance).items()
        if not key.startswith("_")
    }
