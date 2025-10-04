from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
from enum import Enum as PyEnum

Base = declarative_base()

# --- ✅ SQLAlchemy Enum for user roles ---


class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"


# --- ✅ SQLAlchemy ORM Model ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    credits = Column(Integer, default=100)
