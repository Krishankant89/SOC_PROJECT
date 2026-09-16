"""Security event ingestion endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.alert import AlertCreate, AlertRead
from app.schemas.event import EventCreate
from app.services import alerts as alert_service
from app.services.event_generator import generate_demo_event

router = APIRouter(prefix="/events", tags=["events"])


@router.post(
    "",
    response_model=AlertRead,
    status_code=status.HTTP_201_CREATED,
)
def ingest_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
) -> AlertRead:
    alert_payload = AlertCreate(
        source=payload.source,
        source_ip=payload.source_ip,
        destination_ip=payload.destination_ip,
        host=payload.host,
        rule_name=payload.rule_name,
        severity=payload.severity,
        description=payload.description,
        raw_event=payload.raw_event,
        timestamp=payload.timestamp,
    )

    return alert_service.create_alert(db, alert_payload)


@router.post(
    "/demo",
    response_model=AlertRead,
    status_code=status.HTTP_201_CREATED,
)
def generate_demo_event_endpoint(
    db: Session = Depends(get_db),
) -> AlertRead:
    """Generate one simulated security event for local testing."""

    return generate_demo_event(db)
