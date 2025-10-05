from fastapi import FastAPI
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

# --- Initialize DB ---


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# --- Combined GraphQL Schema ---
# Enhance Mutation with ActivityService


@strawberry.type
class CombinedMutation(auth.Mutation, ActivityMutationType):
    @strawberry.mutation
    async def create_activity_with_service(self, info, user_id: int, activity_type: str, details: str | None) -> auth.ActivityType:
        db = info.context["db"]
        service = ActivityService(db)
        return service.create_activity(user_id, activity_type, details)


schema = strawberry.Schema(
    query=auth.Query,
    mutation=CombinedMutation
)

# --- GraphQL Router with DB context ---


def get_context():
    db = next(get_db())
    try:
        return {"db": db}
    finally:
        db.close()


graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# --- OAuth Router ---
app.include_router(oauth_router, prefix="/oauth")

# --- Health Route ---


@app.get("/", tags=["Health"])
def root():
    return {"message": "🚀 Optimaize GraphQL API running successfully"}
