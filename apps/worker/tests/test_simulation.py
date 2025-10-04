import numpy as np

from epidemic_sim_worker.simulation.model import NpiSchedule, SeirdParams, simulate


def test_population_conservation() -> None:
    population = np.array([1000.0, 1500.0])
    params = SeirdParams(
        beta=0.25,
        sigma=0.2,
        gamma=0.1,
        mu=0.01,
        dt=1.0,
        population=population,
        mobility=np.eye(2),
    )
    initial_state = {
        "S": population - 10,
        "E": np.zeros(2),
        "I": np.array([10.0, 10.0]),
        "R": np.zeros(2),
        "D": np.zeros(2),
    }
    frames = simulate(initial_state, params, horizon=10, npi_schedule=[NpiSchedule(day=5, beta_multiplier=0.8)])
    total = frames["S"] + frames["E"] + frames["I"] + frames["R"] + frames["D"]
    assert np.allclose(total, population, atol=1e-3)
