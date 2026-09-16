"""
SQLAlchemy ORM model for audit log entries.
Tracks all significant actions performed in the SOC platform.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    # ── Primary key ───────────────────────────────────────────────────────────
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # ── Actor ─────────────────────────────────────────────────────────────────
    actor: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    # Username or system identifier performing the action

    # ── Action ────────────────────────────────────────────────────────────────
    action: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    # e.g. "alert.acknowledge", "incident.create", "host.delete"

    resource_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)

    # ── Details ───────────────────────────────────────────────────────────────
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    # JSON string with before/after state or extra context

    # ── Origin ────────────────────────────────────────────────────────────────
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)

    # ── Timestamp ─────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<AuditLog id={self.id!r} actor={self.actor!r} action={self.action!r}>"
