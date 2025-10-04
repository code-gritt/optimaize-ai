from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from core.routes import auth
from core.dependencies.db import get_db, Base, engine

# --- FastAPI App ---
app = FastAPI(title="Optimaize Backend", version="1.0")

# --- CORS ---
origins = [
    "https://optimaize-omega.vercel.app",
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
Base.metadata.create_all(bind=engine)

# --- GraphQL Schema ---
schema = strawberry.Schema(query=auth.Query, mutation=auth.Mutation)

# --- GraphQL Router with DB context ---


def get_context():
    db = next(get_db())
    try:
        return {"db": db}
    finally:
        db.close()


graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")


# --- Health Route ---
@app.get("/", tags=["Health"])
def root():
    return {"message": "🚀 Optimaize GraphQL API running successfully"}
