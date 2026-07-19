from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from app.schemas.finding import Finding
from app.schemas.project import Project as ProjectSchema

class ReviewBase(BaseModel):
    status: Optional[str] = "PENDING"
    summary: Optional[str] = None
    pylint_score: Optional[str] = None
    bandit_summary: Optional[str] = None
    maintainability_index: Optional[str] = None
    cyclomatic_complexity: Optional[str] = None
    ai_score: Optional[str] = None
    ai_summary: Optional[str] = None
    documentation: Optional[str] = None

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
    project: Optional[ProjectSchema] = None
