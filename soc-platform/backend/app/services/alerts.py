"""Alert query and persistence helpers."""

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate
from app.services.audit import record_audit


def list_alerts(db: Session, skip: int = 0, limit: int = 50) -> list[Alert]:
    stmt = (
        select(Alert)
        .order_by(Alert.timestamp.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def get_alert(db: Session, alert_id: str) -> Alert | None:
    return db.get(Alert, alert_id)


def create_alert(db: Session, payload: AlertCreate) -> Alert:
    data = payload.model_dump()
    timestamp = data.pop("timestamp") or datetime.now(timezone.utc)

    alert = Alert(**data, timestamp=timestamp)
    db.add(alert)
    db.flush()

    record_audit(
        db,
        actor="system",
        action="alert.create",
        resource_type="alert",
        resource_id=alert.id,
        detail=f"Created alert {alert.rule_name} on {alert.host}",
    )

    # Local import avoids the alerts <-> correlation import cycle.
    from app.services.correlation import correlate_alert

    correlate_alert(db, alert)

    db.commit()
    db.refresh(alert)

    return alert


def update_alert_status(
    db: Session,
    alert_id: str,
    status: str,
) -> Alert | None:
    alert = db.get(Alert, alert_id)

    if alert is None:
        return None

    old_status = alert.status
    alert.status = status

    record_audit(
        db,
        actor="analyst",
        action="alert.status_update",
        resource_type="alert",
        resource_id=alert.id,
        detail=(
            f"Changed alert '{alert.rule_name}' "
            f"from {old_status} to {status}"
        ),
    )

    db.commit()
    db.refresh(alert)

    return alert
