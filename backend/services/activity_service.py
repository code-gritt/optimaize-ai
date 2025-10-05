from sqlalchemy.orm import Session
from core.models.activity import Activity
from core.types import ActivityType
from core.tasks import log_audit


class ActivityService:
    def __init__(self, db: Session):
        self.db = db

    def create_activity(self, user_id: int, activity_type: str, details: str | None) -> ActivityType:
        activity = Activity(
            user_id=user_id, activity_type=activity_type, details=details)
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        # Create a copy to avoid SQLAlchemy issues
        activity_dict = activity.__dict__.copy()
        log_audit.delay(activity_dict)  # Trigger background task
        return ActivityType(**activity_dict)
