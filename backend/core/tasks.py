from celery import Celery
from config.settings import settings
import logging

# Configure Celery
celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Configure logging to audit_log.txt
logging.basicConfig(filename="audit_log.txt",
                    level=logging.INFO, format="%(asctime)s - %(message)s")


@celery_app.task
def log_audit(activity: dict):
    log_entry = f"User ID: {activity['user_id']}, Action: {activity['activity_type']}, Details: {activity['details']}, Timestamp: {activity['timestamp']}"
    logging.info(log_entry)
