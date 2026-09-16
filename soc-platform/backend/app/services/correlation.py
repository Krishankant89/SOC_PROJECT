"""Alert correlation and incident detection."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.incident import Incident
from app.services.audit import record_audit


CORRELATION_WINDOW_MINUTES = 5
FAILED_LOGIN_THRESHOLD = 3
PORT_SCAN_THRESHOLD = 3


def correlate_alert(db: Session, alert: Alert) -> Incident | None:
    """Check whether an alert belongs to a known attack pattern."""

    window_start = datetime.now(timezone.utc) - timedelta(
        minutes=CORRELATION_WINDOW_MINUTES
    )

    recent_alerts = list(
        db.scalars(
            select(Alert)
            .where(Alert.timestamp >= window_start)
            .order_by(Alert.timestamp.desc())
        ).all()
    )

    failed_logins = [
        item
        for item in recent_alerts
        if "failed login" in item.rule_name.lower()
    ]

    if len(failed_logins) >= FAILED_LOGIN_THRESHOLD:
        return _create_incident(
            db=db,
            title="Brute Force Authentication Attack",
            description=(
                f"{len(failed_logins)} failed login events detected "
                f"within {CORRELATION_WINDOW_MINUTES} minutes."
            ),
            severity="critical",
        )

    port_scans = [
        item
        for item in recent_alerts
        if "port scan" in item.rule_name.lower()
    ]

    if len(port_scans) >= PORT_SCAN_THRESHOLD:
        return _create_incident(
            db=db,
            title="Possible Port Scan Attack",
            description=(
                f"{len(port_scans)} port-scan events detected "
                f"within {CORRELATION_WINDOW_MINUTES} minutes."
            ),
            severity="critical",
        )

    return None


def _create_incident(
    db: Session,
    title: str,
    description: str,
    severity: str,
) -> Incident:
    """Create an incident if one is not already active."""

    existing = db.scalar(
        select(Incident)
        .where(Incident.title == title)
        .where(Incident.status.in_(["open", "investigating"]))
    )

    if existing:
        return existing

    incident = Incident(
        title=title,
        description=description,
        severity=severity,
        status="open",
        assigned_to=None,
    )

    db.add(incident)
    db.flush()

    record_audit(
        db,
        actor="correlation-engine",
        action="incident.create",
        resource_type="incident",
        resource_id=incident.id,
        detail=f"Automatically created incident '{title}'",
    )

    return incident
