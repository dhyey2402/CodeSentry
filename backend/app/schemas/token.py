"""
schemas/token.py

Pydantic models for Authentication Tokens.

Why it is needed:
When a user logs in, we respond with a JSON object containing the access_token.
These schemas strictly type that response.
"""

from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str | None = None
