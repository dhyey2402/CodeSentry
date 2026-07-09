"""
db/database.py

This file configures the SQLAlchemy Engine and SessionLocal.

Why it is needed:
1. Engine: Manages the connection pool to the PostgreSQL database.
2. SessionLocal: A factory for creating new database sessions for each request.
   We use sessions to query and save objects.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# create_engine establishes the connection to the DB.
# pool_pre_ping=True ensures connections are still valid before using them.
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True
)

# SessionLocal is the factory we will use in our dependency (get_db).
# autocommit=False ensures we control when transactions are committed.
# autoflush=False prevents automatic flushing of changes to the DB before commit.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
