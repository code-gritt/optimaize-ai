from sqlalchemy import Column, Integer, String, DateTime
from core.dependencies.db import Base
from sqlalchemy.sql import func


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to User
    # e.g., "upload_repo", "review_start", "review_end"
    activity_type = Column(String, nullable=False)
    details = Column(String, nullable=True)  # e.g., repo URL or review notes
    timestamp = Column(DateTime(timezone=True),
                       server_default=func.now(), nullable=False)
