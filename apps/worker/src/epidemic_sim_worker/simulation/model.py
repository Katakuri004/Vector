from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import numpy as np
from numba import njit


@dataclass
class SeirdParams:
    beta: float
    sigma: float
    gamma: float
    mu: float
    dt: float
    population: np.ndarray
    mobility: np.ndarray


@dataclass
class NpiSchedule:
    day: int
    beta_multiplier: float = 1.0
    mobility_multiplier: float = 1.0


@njit(cache=True)
def _rk4_step(
    S: np.ndarray,
    E: np.ndarray,
    I: np.ndarray,
    R: np.ndarray,
    D: np.ndarray,
    beta: float,
    sigma: float,
    gamma: float,
    mu: float,
    dt: float,
    population: np.ndarray,
    mobility: np.ndarray,
    beta_scale: float,
    mobility_scale: float,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    mobility_scaled = mobility * mobility_scale
    outbound = mobility_scaled @ np.ones_like(S)

    def derivs(S_state, E_state, I_state, R_state, D_state):
        force = beta * beta_scale * S_state * I_state / population
        dS = -force
        dE = force - sigma * E_state
        dI = sigma * E_state - (gamma + mu) * I_state
        dR = gamma * I_state
        dD = mu * I_state

        inflow_S = mobility_scaled.T @ S_state - outbound * S_state
        inflow_E = mobility_scaled.T @ E_state - outbound * E_state
        inflow_I = mobility_scaled.T @ I_state - outbound * I_state
        inflow_R = mobility_scaled.T @ R_state - outbound * R_state

        dS += inflow_S
        dE += inflow_E
        dI += inflow_I
        dR += inflow_R
        return dS, dE, dI, dR, dD

    k1 = derivs(S, E, I, R, D)
    k2 = derivs(
        S + 0.5 * dt * k1[0],
        E + 0.5 * dt * k1[1],
        I + 0.5 * dt * k1[2],
        R + 0.5 * dt * k1[3],
        D + 0.5 * dt * k1[4],
    )
    k3 = derivs(
        S + 0.5 * dt * k2[0],
        E + 0.5 * dt * k2[1],
        I + 0.5 * dt * k2[2],
        R + 0.5 * dt * k2[3],
        D + 0.5 * dt * k2[4],
    )
    k4 = derivs(
        S + dt * k3[0],
        E + dt * k3[1],
        I + dt * k3[2],
        R + dt * k3[3],
        D + dt * k3[4],
    )

    S_next = S + (dt / 6.0) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])
    E_next = E + (dt / 6.0) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])
    I_next = I + (dt / 6.0) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2])
    R_next = R + (dt / 6.0) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3])
    D_next = D + (dt / 6.0) * (k1[4] + 2 * k2[4] + 2 * k3[4] + k4[4])

    S_next = np.maximum(S_next, 0.0)
    E_next = np.maximum(E_next, 0.0)
    I_next = np.maximum(I_next, 0.0)
    R_next = np.maximum(R_next, 0.0)
    D_next = np.maximum(D_next, 0.0)

    return S_next, E_next, I_next, R_next, D_next


def simulate(
    initial_state: dict[str, np.ndarray],
    params: SeirdParams,
    horizon: int,
    npi_schedule: Iterable[NpiSchedule] | None = None,
) -> dict[str, np.ndarray]:
    S = initial_state["S"].astype(np.float64)
    E = initial_state["E"].astype(np.float64)
    I = initial_state["I"].astype(np.float64)
    R = initial_state["R"].astype(np.float64)
    D = initial_state["D"].astype(np.float64)

    frames = {
        "S": np.zeros((horizon + 1, S.shape[0])),
        "E": np.zeros((horizon + 1, S.shape[0])),
        "I": np.zeros((horizon + 1, S.shape[0])),
        "R": np.zeros((horizon + 1, S.shape[0])),
        "D": np.zeros((horizon + 1, S.shape[0])),
    }
    frames["S"][0] = S
    frames["E"][0] = E
    frames["I"][0] = I
    frames["R"][0] = R
    frames["D"][0] = D

    schedule = sorted(list(npi_schedule or []), key=lambda item: item.day)
    schedule_index = 0
    beta_multiplier = 1.0
    mobility_multiplier = 1.0

    for step in range(1, horizon + 1):
        while schedule_index < len(schedule) and schedule[schedule_index].day <= step:
            beta_multiplier = schedule[schedule_index].beta_multiplier
            mobility_multiplier = schedule[schedule_index].mobility_multiplier
            schedule_index += 1
        S, E, I, R, D = _rk4_step(
            S,
            E,
            I,
            R,
            D,
            params.beta,
            params.sigma,
            params.gamma,
            params.mu,
            params.dt,
            params.population,
            params.mobility,
            beta_multiplier,
            mobility_multiplier,
        )
        frames["S"][step] = S
        frames["E"][step] = E
        frames["I"][step] = I
        frames["R"][step] = R
        frames["D"][step] = D

    return frames
