"""
SQLAlchemy ORM model for security alerts.
Sources: Wazuh, Suricata (raw events stored as JSON text).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    # ── Primary key ───────────────────────────────────────────────────────────
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # ── Timing ────────────────────────────────────────────────────────────────
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # ── Source information ────────────────────────────────────────────────────
    source: Mapped[str] = mapped_column(String(64), nullable=False)           # e.g. "Wazuh", "Suricata"
    source_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)  # IPv4 or IPv6
    destination_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)

    # ── Target host ───────────────────────────────────────────────────────────
    host: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # ── Alert details ─────────────────────────────────────────────────────────
    rule_name: Mapped[str] = mapped_column(String(512), nullable=False)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    # severity values: critical | high | medium | low | info

    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="new",
        index=True,
    )
    # status values: new | acknowledged | resolved

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ── Raw event payload ─────────────────────────────────────────────────────
    raw_event: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Stored as JSON string; kept as Text to avoid DB-specific JSON types.

    def __repr__(self) -> str:
        return f"<Alert id={self.id!r} severity={self.severity!r} host={self.host!r}>"
