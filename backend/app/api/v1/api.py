"""
api/v1/api.py

This file aggregates all the routers for API version 1.

Why it is needed:
As the app grows, we'll have routers for users, projects, reviews, etc.
Centralizing them here keeps main.py clean.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth

api_router = APIRouter()

# Include the auth router and set a prefix so endpoints are at /auth/...
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
