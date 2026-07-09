"""
models/base.py

This file defines the Declarative Base class.

Why it is needed:
All SQLAlchemy models (User, Project, etc.) will inherit from this Base class.
This allows SQLAlchemy to keep track of all our models in a centralized metadata
registry, which Alembic uses to auto-generate migration scripts.
"""

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
