from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class FindingBase(BaseModel):
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    severity: Optional[str] = None
    issue_type: Optional[str] = None
    description: str
    suggestion: Optional[str] = None

class FindingCreate(FindingBase):
    review_id: UUID

class FindingInDBBase(FindingBase):
    id: UUID
    review_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Finding(FindingInDBBase):
    pass
