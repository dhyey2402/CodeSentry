"""
models/review.py

Defines the Review model.
Represents a single submission of code for analysis.
"""

import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    summary = Column(Text)
    
    # Static Analysis Metrics
    pylint_score = Column(String(10), nullable=True)
    bandit_summary = Column(Text, nullable=True) # E.g., JSON string or summary text
    maintainability_index = Column(String(20), nullable=True)
    cyclomatic_complexity = Column(String(20), nullable=True)
    
    # AI Review Metrics
    ai_score = Column(String(10), nullable=True)
    ai_summary = Column(Text, nullable=True) # JSON structured text
    documentation = Column(Text, nullable=True) # Markdown text
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="reviews")
    findings = relationship("ReviewFinding", back_populates="review", cascade="all, delete-orphan")
