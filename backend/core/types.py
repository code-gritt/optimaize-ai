import strawberry
from datetime import datetime
from pydantic import BaseModel
from enum import Enum
from typing import Optional


# ----------------- Enums -----------------
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


# ----------------- Pydantic Models -----------------
class UserTypeModel(BaseModel):
    id: int
    email: str
    role: UserRole
    credits: int

    class Config:
        from_attributes = True


class ActivityTypeModel(BaseModel):
    id: int
    user_id: int
    activity_type: str
    details: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


# ----------------- Strawberry GraphQL Types -----------------
@strawberry.enum
class UserRoleEnum(Enum):
    USER = UserRole.USER.value
    ADMIN = UserRole.ADMIN.value


@strawberry.type
class UserType:
    id: int
    email: str
    role: UserRoleEnum
    credits: int


@strawberry.type
class ActivityType:
    id: int
    user_id: int
    activity_type: str
    details: Optional[str]
    timestamp: datetime
