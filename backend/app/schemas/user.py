"""
schemas/user.py

Pydantic models for User data.

Why it is needed:
Pydantic schemas validate the incoming JSON payloads (e.g., UserCreate) and 
filter the data we send back to the client (e.g., UserResponse). 
Crucially, UserResponse does NOT include the hashed_password!
"""

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import uuid
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    preferences: Optional[dict] = None

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    preferences: Optional[dict] = None
    created_at: datetime
    
    # This enables Pydantic to read data even if it is not a dict, 
    # but an ORM model (like our SQLAlchemy User model).
    model_config = ConfigDict(from_attributes=True)
