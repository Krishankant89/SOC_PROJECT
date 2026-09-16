"""Host REST endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.host import HostRead
from app.services import hosts as host_service

router = APIRouter(prefix="/hosts", tags=["hosts"])


@router.get("", response_model=list[HostRead])
def list_hosts(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[HostRead]:
    return host_service.list_hosts(db, skip=skip, limit=limit)
