from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClaimCreate(BaseModel):
    reason: str
    ownership_details: Optional[str] = None
    verification_answer: Optional[str] = None

class ClaimUpdateStatus(BaseModel):
    status: str # Approved, Rejected

class ClaimResponse(BaseModel):
    id: int
    item_id: int
    claimer_id: int
    reason: str
    ownership_details: Optional[str] = None
    verification_answer: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
