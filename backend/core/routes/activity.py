from fastapi import APIRouter
from strawberry import mutation
import strawberry
from core.models.activity import Activity
from core.dependencies.db import get_db
from sqlalchemy.orm import Session
from datetime import datetime
from core.types import ActivityType  # Import from new types file

router = APIRouter()


@strawberry.type
class ActivityResponse:
    success: bool
    activity: ActivityType | None
    error: str | None


@strawberry.input
class CreateActivityInput:
    user_id: int
    activity_type: str
    details: str | None


@strawberry.input
class UpdateActivityInput:
    id: int
    activity_type: str
    details: str | None


@strawberry.type
class ActivityMutation:
    @mutation
    async def create_activity(self, info, input: CreateActivityInput) -> ActivityResponse:
        db: Session = info.context["db"]
        try:
            activity = Activity(**input.__dict__)
            db.add(activity)
            db.commit()
            db.refresh(activity)
            return ActivityResponse(success=True, activity=ActivityType(**activity.__dict__), error=None)
        except Exception as e:
            db.rollback()
            return ActivityResponse(success=False, activity=None, error=str(e))

    @mutation
    async def update_activity(self, info, input: UpdateActivityInput) -> ActivityResponse:
        db: Session = info.context["db"]
        try:
            activity = db.query(Activity).filter(
                Activity.id == input.id).first()
            if not activity:
                return ActivityResponse(success=False, activity=None, error="Activity not found")
            for key, value in input.__dict__.items():
                if key != "id" and value is not None:
                    setattr(activity, key, value)
            db.commit()
            db.refresh(activity)
            return ActivityResponse(success=True, activity=ActivityType(**activity.__dict__), error=None)
        except Exception as e:
            db.rollback()
            return ActivityResponse(success=False, activity=None, error=str(e))

    @mutation
    async def delete_activity(self, info, id: int) -> ActivityResponse:
        db: Session = info.context["db"]
        try:
            activity = db.query(Activity).filter(Activity.id == id).first()
            if not activity:
                return ActivityResponse(success=False, activity=None, error="Activity not found")
            db.delete(activity)
            db.commit()
            return ActivityResponse(success=True, activity=None, error=None)
        except Exception as e:
            db.rollback()
            return ActivityResponse(success=False, activity=None, error=str(e))


# Export mutation class for schema combination
ActivityMutationType = ActivityMutation
