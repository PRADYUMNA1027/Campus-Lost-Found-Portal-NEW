from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.item import Item
from app.models.claim import Claim
from app.models.user import User
from app.middleware.auth import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    total_users = db.query(User).count()
    total_lost = db.query(Item).filter(Item.status == "Lost").count()
    total_found = db.query(Item).filter(Item.status == "Found").count()
    pending_claims = db.query(Claim).filter(Claim.status == "Pending").count()
    returned_items = db.query(Item).filter(Item.status == "Returned").count()

    return {
        "total_users": total_users,
        "total_lost_items": total_lost,
        "total_found_items": total_found,
        "pending_claims": pending_claims,
        "returned_items": returned_items
    }

@router.get("/items")
def get_admin_items(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    return db.query(Item).order_by(Item.id.desc()).all()

@router.get("/claims")
def get_admin_claims(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    return db.query(Claim).order_by(Claim.id.desc()).all()
