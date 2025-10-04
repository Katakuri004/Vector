from __future__ import annotations

import asyncio

from rq import Connection, Queue, Worker
import redis

from epidemic_sim_worker.config.settings import get_settings
from epidemic_sim_worker.logging import configure_logging, get_logger

configure_logging()
LOGGER = get_logger(__name__)


def main() -> None:
    settings = get_settings()
    redis_conn = redis.from_url(settings.redis_url)
    queue = Queue(settings.run_queue_name, connection=redis_conn)
    LOGGER.info("worker.boot", queue=settings.run_queue_name)
    with Connection(redis_conn):
        worker = Worker([queue])
        worker.work(with_scheduler=True)


if __name__ == "__main__":
    main()
