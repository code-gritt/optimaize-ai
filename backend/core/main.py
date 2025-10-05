from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from core.routes import auth
from core.routes.oauth import router as oauth_router
from core.routes.activity import ActivityMutationType  # Import mutation type
from core.dependencies.db import get_db, Base, engine

# --- FastAPI App ---
app = FastAPI(title="Optimaize Backend", version="1.0")

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

# --- Initialize DB ---


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# --- Combined GraphQL Schema ---
# Fix: Use the Mutation class from auth.py and combine with ActivityMutationType
CombinedMutation = strawberry.union(
    "Mutation", (auth.Mutation, ActivityMutationType))
schema = strawberry.Schema(
    query=auth.Query,
    mutation=CombinedMutation  # Use the combined mutation type
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
