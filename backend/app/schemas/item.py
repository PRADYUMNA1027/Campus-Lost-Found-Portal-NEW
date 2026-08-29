from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ItemBase(BaseModel):
    item_name: str
    description: str
    category: str
    location: str
    date: str
    time: Optional[str] = None
    image_url: Optional[str] = None
    reward: Optional[str] = None
    storage_location: Optional[str] = None
    verification_question: Optional[str] = None

class ItemCreateLost(ItemBase):
    contact_info: Optional[str] = None

class ItemCreateFound(ItemBase):
    pass

class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    storage_location: Optional[str] = None

class ItemResponse(ItemBase):
    id: int
    status: str
    owner_id: Optional[int] = None
    reporter_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
