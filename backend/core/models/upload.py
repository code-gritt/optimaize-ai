from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Upload(Base):
    __tablename__ = "uploads"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    url = Column(String, nullable=False)
    analysis = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
