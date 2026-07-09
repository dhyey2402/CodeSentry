"""
api/v1/endpoints/auth.py

Authentication endpoints for registering and logging in users.
"""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import SessionDep, CurrentUser
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: SessionDep) -> Any:
    """
    Register a new user.
    Checks if the email already exists, hashes the password, and saves the user.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login_access_token(
    db: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    OAuth2PasswordRequestForm expects 'username' (which we treat as email) and 'password'.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    # Generate the JWT token
    access_token = security.create_access_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: CurrentUser) -> Any:
    """
    Get current user profile.
    This route is protected because it depends on `CurrentUser`.
    """
    return current_user
