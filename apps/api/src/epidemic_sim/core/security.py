from __future__ import annotations

from functools import lru_cache
from typing import Annotated

import httpx
from fastapi import Header, Query
from jwt import decode as jwt_decode
from jwt import get_unverified_header
from jwt.algorithms import RSAAlgorithm

from epidemic_sim.config.settings import get_settings
from epidemic_sim.core.errors import ApiError


class AuthContext:
    def __init__(self, sub: str, email: str | None) -> None:
        self.sub = sub
        self.email = email


@lru_cache(maxsize=1)
async def fetch_jwks() -> dict[str, dict[str, str]]:
    settings = get_settings()
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get(str(settings.clerk_jwks_url))
        response.raise_for_status()
        jwks = response.json()
        return {key["kid"]: key for key in jwks.get("keys", [])}


async def resolve_auth(
    authorization: Annotated[str | None, Header(alias="Authorization")],
    token: Annotated[str | None, Query(alias="token", default=None)],
) -> AuthContext:
    raw_token: str | None = None
    if authorization:
        scheme, _, candidate = authorization.partition(" ")
        if scheme.lower() != "bearer" or not candidate:
            raise ApiError(code="auth.invalid", title="Invalid authorization header", status_code=401)
        raw_token = candidate
    elif token:
        raw_token = token

    if not raw_token:
        raise ApiError(code="auth.required", title="Authentication required", status_code=401)

    jwks = await fetch_jwks()
    header = get_unverified_header(raw_token)
    kid = header.get("kid")
    if not kid:
        raise ApiError(code="auth.missing_kid", title="Missing key identifier", status_code=401)
    jwk = jwks.get(kid)
    if not jwk:
        raise ApiError(code="auth.unknown_key", title="Unknown signing key", status_code=401)

    public_key = RSAAlgorithm.from_jwk(jwk)
    payload = jwt_decode(
        raw_token,
        key=public_key,
        algorithms=[header.get("alg", "RS256")],
        options={"verify_aud": False},
    )
    sub = payload.get("sub")
    if not sub:
        raise ApiError(code="auth.invalid_token", title="Invalid token", status_code=401)
    return AuthContext(sub=sub, email=payload.get("email"))
