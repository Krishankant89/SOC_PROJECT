"""Pydantic schemas for alerts."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import AlertStatus, Severity


class AlertBase(BaseModel):
    source: str = Field(..., min_length=1, max_length=64)
    source_ip: str | None = Field(default=None, max_length=45)
    destination_ip: str | None = Field(default=None, max_length=45)
    host: str = Field(..., min_length=1, max_length=255)
    rule_name: str = Field(..., min_length=1, max_length=512)
    severity: Severity
    status: AlertStatus = AlertStatus.new
    description: str | None = None
    raw_event: str | None = None
    timestamp: datetime | None = None


class AlertCreate(AlertBase):
    pass


class AlertRead(AlertBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    timestamp: datetime


class AlertUpdate(BaseModel):
    status: AlertStatus
