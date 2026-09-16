"""Incident query and persistence helpers."""

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate
from app.services.audit import record_audit


def list_incidents(db: Session, skip: int = 0, limit: int = 50) -> list[Incident]:
    stmt = (
        select(Incident)
        .order_by(Incident.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def get_incident(db: Session, incident_id: str) -> Incident | None:
    return db.get(Incident, incident_id)


def create_incident(db: Session, payload: IncidentCreate) -> Incident:
    incident = Incident(**payload.model_dump())

    db.add(incident)
    db.flush()

    record_audit(
        db,
        actor="system",
        action="incident.create",
        resource_type="incident",
        resource_id=incident.id,
        detail=f"Created incident '{incident.title}'",
    )

    db.commit()
    db.refresh(incident)

    return incident


def update_incident(
    db: Session,
    incident_id: str,
    payload: IncidentUpdate,
) -> Incident | None:
    incident = db.get(Incident, incident_id)

    if incident is None:
        return None

    updates = payload.model_dump(exclude_unset=True)
    changes: list[str] = []

    for field, value in updates.items():
        old_value = getattr(incident, field)

        if old_value != value:
            setattr(incident, field, value)
            changes.append(f"{field}: {old_value} -> {value}")

    incident.updated_at = datetime.now(timezone.utc)

    if changes:
        record_audit(
            db,
            actor="analyst",
            action="incident.update",
            resource_type="incident",
            resource_id=incident.id,
            detail="; ".join(changes),
        )

    db.commit()
    db.refresh(incident)

    return incident
