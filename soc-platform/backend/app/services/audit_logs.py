"""Audit log query helpers."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def list_audit_logs(db: Session, skip: int = 0, limit: int = 50) -> list[AuditLog]:
    stmt = (
        select(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())
