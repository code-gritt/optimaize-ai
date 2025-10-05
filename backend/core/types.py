import strawberry
from datetime import datetime


@strawberry.type
class ActivityType:
    id: int
    user_id: int
    activity_type: str
    details: str | None
    timestamp: datetime
