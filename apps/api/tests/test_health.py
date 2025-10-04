import pytest
from httpx import AsyncClient

from epidemic_sim.api.main import app


@pytest.mark.asyncio
async def test_health() -> None:
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
