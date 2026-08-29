from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student")  # 'student' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", foreign_keys="[Item.reporter_id]", back_populates="reporter")
    claims = relationship("Claim", back_populates="claimer")
    notifications = relationship("Notification", back_populates="user")
