"""Background security event generator."""

import asyncio
import logging

from app.database import SessionLocal
from app.services.event_generator import generate_demo_event

logger = logging.getLogger(__name__)

EVENT_INTERVAL_SECONDS = 8


async def event_generation_loop() -> None:
    """Continuously generate demo security events."""

    while True:
        db = SessionLocal()

        try:
            alert = generate_demo_event(db)

            logger.info(
                "Generated demo security event: %s [%s]",
                alert.rule_name,
                alert.severity,
            )

        except Exception:
            logger.exception("Failed to generate demo security event")

        finally:
            db.close()

        await asyncio.sleep(EVENT_INTERVAL_SECONDS)