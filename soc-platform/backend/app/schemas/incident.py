"""Pydantic schemas for incidents."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import IncidentStatus, Severity


class IncidentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    description: str | None = None
    severity: Severity
    status: IncidentStatus = IncidentStatus.open
    assigned_to: str | None = Field(default=None, max_length=255)


class IncidentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=512)
    description: str | None = None
    severity: Severity | None = None
    status: IncidentStatus | None = None
    assigned_to: str | None = Field(default=None, max_length=255)


class IncidentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None
    severity: Severity
    status: IncidentStatus
    assigned_to: str | None
    created_at: datetime
    updated_at: datetime
