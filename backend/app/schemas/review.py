from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from app.schemas.finding import Finding

class ReviewBase(BaseModel):
    status: Optional[str] = "PENDING"
    summary: Optional[str] = None

class ReviewCreate(ReviewBase):
    project_id: UUID

class ReviewUpdate(BaseModel):
    status: Optional[str] = None
    summary: Optional[str] = None

class ReviewInDBBase(ReviewBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Review(ReviewInDBBase):
    findings: List[Finding] = []
