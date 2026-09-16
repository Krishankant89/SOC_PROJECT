"""SOC Platform FastAPI application entrypoint."""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.config import settings
from app.database import SessionLocal, init_db
from app.models.host import Host
from app.routes.alerts import router as alerts_router
from app.routes.audit_logs import router as audit_logs_router
from app.routes.events import router as events_router
from app.routes.health import router as health_router
from app.routes.hosts import router as hosts_router
from app.routes.incidents import router as incidents_router
from app.services.event_loop import event_generation_loop


def _seed_hosts_if_empty() -> None:
    """Insert sample hosts so GET /api/hosts is usable in local dev."""

    db = SessionLocal()

    try:
        existing = db.scalar(select(Host.id).limit(1))

        if existing is not None:
            return

        now = datetime.now(timezone.utc)

        db.add_all(
            [
                Host(
                    hostname="siem-collector-01",
                    ip_address="10.0.10.12",
                    os="Ubuntu 24.04 LTS",
                    agent_version="4.9.0",
                    status="online",
                    alert_count=0,
                    last_seen=now,
                ),
                Host(
                    hostname="workstation-finance-07",
                    ip_address="10.0.20.44",
                    os="Windows 11",
                    agent_version="4.9.0",
                    status="warning",
                    alert_count=0,
                    last_seen=now,
                ),
            ]
        )

        db.commit()

    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    _seed_hosts_if_empty()

    event_task = asyncio.create_task(event_generation_loop())

    try:
        yield
    finally:
        event_task.cancel()

        try:
            await event_task
        except asyncio.CancelledError:
            pass


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(alerts_router, prefix="/api")
app.include_router(events_router, prefix="/api")
app.include_router(incidents_router, prefix="/api")
app.include_router(hosts_router, prefix="/api")
app.include_router(audit_logs_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
