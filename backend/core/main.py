from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from core.routes import auth
from core.routes.oauth import router as oauth_router
from core.routes.activity import ActivityMutationType
from core.dependencies.db import get_db, Base, engine
from config.settings import settings
from services.activity_service import ActivityService
from core.types import ActivityType
from core.routes.upload import UploadMutation  # Import new mutation

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

# --- DB Initialization ---


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# --- Strawberry GraphQL context ---


def get_context(request: Request):
    db = next(get_db())
    try:
        return {"db": db, "request": request}
    finally:
        db.close()

# --- Combined GraphQL schema ---


@strawberry.type
# Include UploadMutation
class CombinedMutation(auth.Mutation, ActivityMutationType, UploadMutation):
    pass


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
