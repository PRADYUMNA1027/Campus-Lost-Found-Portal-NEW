from pydantic import BaseModel
from datetime import datetime

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    message: str
    read_status: bool
    created_at: datetime

    class Config:
        from_attributes = True
