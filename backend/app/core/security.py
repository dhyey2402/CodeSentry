"""
core/security.py

This file handles password hashing and JWT (JSON Web Token) creation/verification.

Why it is needed:
1. Passwords must never be stored in plain text. We use bcrypt to hash them.
2. JWTs provide a stateless way to authenticate users. The server signs the token,
   and the client sends it back with every request.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt
import bcrypt
from app.core.config import settings

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Creates a JWT access token.
    'subject' is usually the user ID.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies if a plain password matches the hashed password from the DB.
    """
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """
    Hashes a plain text password using bcrypt directly to avoid passlib incompatibilities.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
