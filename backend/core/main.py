from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from core.routes import auth
from core.routes.oauth import router as oauth_router
from core.routes.activity import ActivityMutationType
from core.dependencies.db import get_db, Base, engine
from config.settings import settings
from middleware.response_modification import ResponseModificationMiddleware
from services.activity_service import ActivityService
from core.permissions import api_key_auth, get_current_user, check_role, UserRole
from core.tasks import log_audit  # Ensure task is imported for Celery
from core.models.user import User

# --- FastAPI App ---
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# --- CORS ---
origins = [
    "https://optimaizer.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Custom Middleware ---
app.add_middleware(ResponseModificationMiddleware)

# --- Initialize DB ---


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# --- Combined GraphQL Schema ---


@strawberry.type
class CombinedMutation(auth.Mutation, ActivityMutationType):
    @strawberry.mutation
    async def create_activity_with_service(
        self, info, user_id: int, activity_type: str, details: str | None
    ) -> auth.ActivityType:
        db = info.context["db"]
        service = ActivityService(db)
        activity = service.create_activity(user_id, activity_type, details)
        return activity

    @strawberry.mutation
    async def delete_all_activities(self, info) -> bool:
        db = info.context["db"]
        user = info.context["user"]
        check_role(UserRole.ADMIN, user)  # Check role using context
        db.query(auth.Activity).delete()
        db.commit()
        return True


# --- GraphQL Schema ---
schema = strawberry.Schema(
    query=auth.Query,
    mutation=CombinedMutation
)

# --- GraphQL Router with DB context and Security ---


def get_context(user: User = Depends(get_current_user)):
    db = next(get_db())
    try:
        return {"db": db, "user": user}
    finally:
        db.close()


graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
    dependencies=[Depends(api_key_auth)]
)
app.include_router(graphql_app, prefix="/graphql")

# --- OAuth Router ---
app.include_router(oauth_router, prefix="/oauth")

# --- Health Check Route ---


@app.get("/", tags=["Health"])
def root():
    return {"message": "🚀 Optimaize GraphQL API running successfully"}
