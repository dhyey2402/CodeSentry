"""
models/finding.py

Defines the ReviewFinding model.
Represents an individual issue found during a code review.
"""

import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base

class ReviewFinding(Base):
    __tablename__ = "review_findings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    review_id = Column(UUID(as_uuid=True), ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    
    file_path = Column(String(500))
    line_number = Column(Integer)
    severity = Column(String(20)) # INFO, WARNING, ERROR, CRITICAL
    issue_type = Column(String(50)) # Security, Performance, Style, etc.
    description = Column(Text, nullable=False)
    suggestion = Column(Text)
    extra_data = Column(JSON, nullable=True, default={})
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    review = relationship("Review", back_populates="findings")
