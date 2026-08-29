from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # Electronics, Documents, Accessories, Bags, Keys, Clothing, Other
    status = Column(String, nullable=False)    # Lost, Found, Claimed, Returned
    image_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    storage_location = Column(String, nullable=True)
    verification_question = Column(String, nullable=True)
    reward = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="items")
    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")
