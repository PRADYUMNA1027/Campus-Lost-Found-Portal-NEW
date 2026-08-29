import os

from dotenv import load_dotenv

# Load environment variables BEFORE importing routes
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.database.session import engine, Base, SessionLocal
from app.routes import (
    auth_router,
    items_router,
    claims_router,
    notifications_router,
    admin_router,
)
from app.utils.seed import seed_database


# ============================================================
# Create Database Tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# Seed Database
# ============================================================

db = SessionLocal()

try:
    seed_database(db)
finally:
    db.close()


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="Campus Lost & Found API",
    description="Backend service powering the Campus Lost & Found recovery portal.",
    version="1.0.0",
)


# ============================================================
# CORS Configuration
# ============================================================

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Session Middleware
# Required by Authlib Google OAuth
# ============================================================

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv(
        "JWT_SECRET",
        "super_secret_jwt_key_campus_lost_found_2026"
    ),
    same_site="lax",
    https_only=False,
)


# ============================================================
# Static Uploads
# ============================================================

uploads_dir = os.path.join(os.getcwd(), "uploads")

os.makedirs(
    uploads_dir,
    exist_ok=True
)

app.mount(
    "/static/uploads",
    StaticFiles(directory=uploads_dir),
    name="uploads",
)


# ============================================================
# API Routers
# ============================================================

app.include_router(auth_router)
app.include_router(items_router)
app.include_router(claims_router)
app.include_router(notifications_router)
app.include_router(admin_router)


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Campus Lost & Found API",
        "documentation": "/docs",
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }