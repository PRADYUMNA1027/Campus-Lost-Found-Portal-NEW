from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.claim import Claim
from app.models.item import Item
from app.models.notification import Notification
from app.models.user import User
from app.schemas.claim import ClaimCreate, ClaimUpdateStatus, ClaimResponse
from app.middleware.auth import get_current_user, get_admin_user
from app.services.email import send_email_notification

router = APIRouter(prefix="/api", tags=["Claims"])

@router.post("/items/{item_id}/claims", response_model=ClaimResponse)
def submit_claim(
    item_id: int,
    claim_in: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    existing_claim = db.query(Claim).filter(
        Claim.item_id == item_id,
        Claim.claimer_id == current_user.id
    ).first()
    if existing_claim:
        raise HTTPException(status_code=400, detail="You have already submitted a claim for this item.")

    claim = Claim(
        item_id=item_id,
        claimer_id=current_user.id,
        reason=claim_in.reason,
        ownership_details=claim_in.ownership_details,
        verification_answer=claim_in.verification_answer,
        status="Pending"
    )
    db.add(claim)
    
    # 1. Notify claimer that claim was submitted
    claimer_notif = Notification(
        user_id=current_user.id,
        type="Claim Submitted",
        message=f"Your claim for '{item.item_name}' was submitted. Admin will review your answers."
    )
    db.add(claimer_notif)
    
    # 2. Notify item reporter/owner if different from claimer
    target_user_ids = set()
    if item.reporter_id and item.reporter_id != current_user.id:
        target_user_ids.add(item.reporter_id)
    if item.owner_id and item.owner_id != current_user.id:
        target_user_ids.add(item.owner_id)

    for uid in target_user_ids:
        owner_notif = Notification(
            user_id=uid,
            type="Claim Received",
            message=f"A new claim was submitted by {current_user.name} for your reported item '{item.item_name}'."
        )
        db.add(owner_notif)

    db.commit()
    db.refresh(claim)

    send_email_notification(
        recipient_email=current_user.email,
        subject=f"Claim Received: {item.item_name}",
        message_body=f"Hello {current_user.name},\n\nYour claim for '{item.item_name}' has been received. Our campus admin team will verify your ownership response shortly."
    )

    return claim

@router.get("/claims", response_model=List[ClaimResponse])
def get_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Claim).order_by(Claim.id.desc()).all()
    return db.query(Claim).filter(Claim.claimer_id == current_user.id).order_by(Claim.id.desc()).all()

@router.put("/claims/{claim_id}", response_model=ClaimResponse)
def update_claim_status(
    claim_id: int,
    status_in: ClaimUpdateStatus,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = status_in.status
    
    item = db.query(Item).filter(Item.id == claim.item_id).first()
    claimer = db.query(User).filter(User.id == claim.claimer_id).first()

    if status_in.status == "Approved" and item:
        item.status = "Claimed"
        item.owner_id = claim.claimer_id

    # 1. Create notification for claimer
    claimer_notif = Notification(
        user_id=claim.claimer_id,
        type=f"Claim {status_in.status}",
        message=f"Your claim for '{item.item_name if item else 'Item'}' has been {status_in.status.lower()} by admin."
    )
    db.add(claimer_notif)

    # 2. If approved, notify item reporter/owner if different from claimer
    if status_in.status == "Approved" and item and item.reporter_id and item.reporter_id != claim.claimer_id:
        reporter_notif = Notification(
            user_id=item.reporter_id,
            type="Item Claimed",
            message=f"The claim for your reported item '{item.item_name}' was approved by admin."
        )
        db.add(reporter_notif)

    db.commit()
    db.refresh(claim)

    if claimer:
        send_email_notification(
            recipient_email=claimer.email,
            subject=f"Claim {status_in.status}: {item.item_name if item else 'Item'}",
            message_body=f"Hello {claimer.name},\n\nYour claim for '{item.item_name if item else 'Item'}' has been {status_in.status}. Please visit the campus security office for details."
        )

    return claim
