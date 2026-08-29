from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.item import Item
from app.models.notification import Notification
from app.models.user import User
from app.schemas.item import ItemCreateLost, ItemCreateFound, ItemUpdate, ItemResponse
from app.middleware.auth import get_current_user, get_optional_current_user
from app.services.storage import save_uploaded_file

router = APIRouter(prefix="/api/items", tags=["Items"])

@router.get("", response_model=List[ItemResponse])
def get_items(
    status: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    query: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Item)
    if status:
        q = q.filter(Item.status == status)
    if category:
        q = q.filter(Item.category == category)
    if location:
        q = q.filter(Item.location == location)
    if query:
        search = f"%{query}%"
        q = q.filter(
            (Item.item_name.ilike(search)) |
            (Item.description.ilike(search)) |
            (Item.location.ilike(search))
        )
    return q.order_by(Item.id.desc()).all()

@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/lost", response_model=ItemResponse)
def create_lost_item(
    item_in: ItemCreateLost,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    reporter_id = current_user.id if current_user else None
    owner_id = current_user.id if current_user else None

    if not reporter_id:
        default_user = db.query(User).first()
        if default_user:
            reporter_id = default_user.id
            owner_id = default_user.id

    item = Item(
        item_name=item_in.item_name,
        description=item_in.description,
        category=item_in.category,
        status="Lost",
        location=item_in.location,
        date=item_in.date,
        time=item_in.time,
        image_url=item_in.image_url,
        reward=item_in.reward,
        reporter_id=reporter_id,
        owner_id=owner_id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.post("/found", response_model=ItemResponse)
def create_found_item(
    item_in: ItemCreateFound,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    reporter_id = current_user.id if current_user else None

    if not reporter_id:
        default_user = db.query(User).first()
        if default_user:
            reporter_id = default_user.id

    item = Item(
        item_name=item_in.item_name,
        description=item_in.description,
        category=item_in.category,
        status="Found",
        location=item_in.location,
        date=item_in.date,
        time=item_in.time,
        image_url=item_in.image_url,
        storage_location=item_in.storage_location,
        verification_question=item_in.verification_question,
        reporter_id=reporter_id
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Check for potential matching lost items and create notification
    matching_lost_items = db.query(Item).filter(
        Item.status == "Lost",
        Item.category == item.category,
        Item.location == item.location
    ).all()

    for lost_item in matching_lost_items:
        if lost_item.reporter_id:
            notif = Notification(
                user_id=lost_item.reporter_id,
                type="New Matching Item",
                message=f"A new found item '{item.item_name}' matching your reported lost item was posted."
            )
            db.add(notif)
    db.commit()

    return item

@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    item_update: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if current_user.role != "admin" and item.reporter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this item")

    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if current_user.role != "admin" and item.reporter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.post("/upload-image")
async def upload_item_image(file: UploadFile = File(...)):
    image_url = await save_uploaded_file(file)
    return {"image_url": image_url}
