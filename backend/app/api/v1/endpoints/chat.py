from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.api.deps import SessionDep, CurrentUser
from app.models.review import Review
from app.models.project import Project
from app.services import openai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/{review_id}", response_model=ChatResponse)
async def chat_with_review(
    *,
    db: SessionDep,
    review_id: UUID,
    current_user: CurrentUser,
    chat_request: ChatRequest
) -> Any:
    """
    Chat with the AI regarding a specific review.
    """
    review = db.query(Review).join(Project).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    try:
        with open(review.project.file_path, "r", encoding="utf-8") as f:
            code = f.read()
    except Exception as e:
        code = "Unable to read source code."

    reply = await openai_service.chat_about_code(
        code=code,
        review_context=review.ai_summary or "",
        user_message=chat_request.message,
        user_preferences=current_user.preferences or {}
    )
    
    return {"reply": reply}
