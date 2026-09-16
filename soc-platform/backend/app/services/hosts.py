"""Host query helpers."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.host import Host


def list_hosts(db: Session, skip: int = 0, limit: int = 50) -> list[Host]:
    stmt = select(Host).order_by(Host.hostname.asc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())
