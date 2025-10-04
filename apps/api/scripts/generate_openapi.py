from __future__ import annotations

import json
from pathlib import Path

from epidemic_sim.api.main import app


OUTPUT = Path(__file__).resolve().parents[1] / "openapi.json"


def main() -> None:
    schema = app.openapi()
    schema["info"]["title"] = app.title
    schema["info"]["version"] = app.version
    with OUTPUT.open("w", encoding="utf-8") as fp:
        json.dump(schema, fp, indent=2)
    print(f"OpenAPI spec written to {OUTPUT}")


if __name__ == "__main__":
    main()
