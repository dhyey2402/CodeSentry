"""
api/deps.py

This file contains FastAPI Dependencies.

Why it is needed:
Dependencies in FastAPI allow us to inject reusable logic into our route handlers.
- `get_db` ensures every request gets its own database session and closes it after.
- `get_current_user` ensures the endpoint is protected, validates the JWT, and 
  fetches the user making the request.
"""

from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.db.database import SessionLocal
from app.core.config import settings
from app.models.user import User
from app.schemas.token import TokenPayload

# OAuth2PasswordBearer is a FastAPI class that extracts the token from the Authorization header.
# tokenUrl is the endpoint where clients can get a token (used by Swagger UI).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator:
    """
    Dependency that creates a new SQLAlchemy SessionLocal that will be used in a single request,
    and then close it once the request is finished.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Type alias for the DB session dependency
SessionDep = Annotated[Session, Depends(get_db)]
# Type alias for the Token dependency
TokenDep = Annotated[str, Depends(oauth2_scheme)]

def get_current_user(db: SessionDep, token: TokenDep) -> User:
    """
    Validates the JWT token, extracts the user ID, and returns the User object.
    Raises 401 Unauthorized or 403 Forbidden on failure.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    # We stored user id as string in the token 'sub'
    user = db.query(User).filter(User.id == token_data.sub).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

# Type alias for endpoints that require the current user
CurrentUser = Annotated[User, Depends(get_current_user)]
