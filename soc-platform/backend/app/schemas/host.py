"""Pydantic schemas for hosts."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.common import HostStatus


class HostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hostname: str
    ip_address: str | None
    os: str | None
    agent_version: str | None
    status: HostStatus
    alert_count: int
    last_seen: datetime | None
    registered_at: datetime
