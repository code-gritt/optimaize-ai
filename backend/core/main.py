from fastapi import FastAPI, Request, HTTPException
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
from core.permissions import validate_api_key, get_current_user_from_token, require_role, UserRole
from core.models.user import User
from core.types import UserType, ActivityType

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
app.add_middleware(ResponseModificationMiddleware)

# --- DB Initialization ---


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)


# --- Strawberry GraphQL context ---
def get_context(request: Request):
    db = next(get_db())
    try:
        user = get_current_user_from_token(request, db)
        return {"db": db, "user": user, "request": request}
    finally:
        db.close()


# --- Combined GraphQL schema ---
@strawberry.type
class CombinedMutation(auth.Mutation, ActivityMutationType):

    @strawberry.mutation
    def create_activity_with_service(
        self, info, user_id: int, activity_type: str, details: str | None
    ) -> ActivityType:
        db = info.context["db"]
        service = ActivityService(db)
        activity = service.create_activity(user_id, activity_type, details)
        return ActivityType(
            id=activity.id,
            user_id=activity.user_id,
            activity_type=activity.activity_type,
            details=activity.details,
            timestamp=activity.timestamp
        )

    @strawberry.mutation
    def delete_all_activities(self, info) -> bool:
        db = info.context["db"]
        user: User = info.context["user"]
        require_role(user, UserRole.ADMIN)
        db.query(auth.Activity).delete()
        db.commit()
        return True


# --- Strawberry GraphQL schema & router ---
schema = strawberry.Schema(
    query=auth.Query,
    mutation=CombinedMutation
)

graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context
)

# --- Include Routers ---
app.include_router(graphql_app, prefix="/graphql")
app.include_router(oauth_router, prefix="/oauth")


# --- Health Check ---
@app.get("/", tags=["Health"])
def root():
    return {"message": "🚀 Optimaize GraphQL API running successfully"}
