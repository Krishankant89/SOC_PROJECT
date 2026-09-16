"""Pydantic schemas for security event ingestion."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import Severity


class EventCreate(BaseModel):
    source: str = Field(..., min_length=1, max_length=64)
    source_ip: str | None = Field(default=None, max_length=45)
    destination_ip: str | None = Field(default=None, max_length=45)
    host: str = Field(..., min_length=1, max_length=255)
    rule_name: str = Field(..., min_length=1, max_length=512)
    severity: Severity
    description: str | None = None
    raw_event: str | None = None
    timestamp: datetime | None = None