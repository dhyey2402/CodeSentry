from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.review import Review
from app.models.project import Project
from app.models.finding import ReviewFinding
from app.models.user import User
from app.schemas.review import Review as ReviewSchema
from app.services.pylint_service import run_pylint_analysis

router = APIRouter()

@router.get("/", response_model=List[ReviewSchema])
def read_reviews(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve reviews for current user's projects.
    """
    reviews = (
        db.query(Review)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return reviews

@router.get("/{id}", response_model=ReviewSchema)
def read_review(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get review by ID.
    """
    review = db.query(Review).join(Project).filter(Review.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return review

@router.post("/analyze/{project_id}", response_model=ReviewSchema)
def analyze_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run static analysis (Pylint) on the uploaded project file.
    Creates a Review and ReviewFindings.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    if not project.file_path or not project.file_path.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only Python files (.py) are supported for Pylint analysis.")
        
    # Create the Review record (Status: PROCESSING)
    review = Review(
        project_id=project.id,
        status="PROCESSING"
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    
    try:
        # Execute the pylint service
        analysis_result = run_pylint_analysis(project.file_path)
        
        # Save findings
        for issue in analysis_result.get("issues", []):
            finding = ReviewFinding(
                review_id=review.id,
                file_path=project.file_path,
                line_number=issue.get("line"),
                severity=issue.get("type", "unknown").upper(),
                issue_type=issue.get("symbol", "unknown"),
                description=issue.get("message", "No description"),
                suggestion=f"Consider reviewing Pylint rule: {issue.get('message-id', '')}"
            )
            db.add(finding)
        
        # Update Review status and summary
        review.status = "COMPLETED"
        review.summary = f"Score: {analysis_result['score']}/10. {analysis_result['summary']}"
        db.commit()
        db.refresh(review)
        
    except Exception as e:
        review.status = "FAILED"
        review.summary = f"Analysis failed: {str(e)}"
        db.commit()
        db.refresh(review)
        raise HTTPException(status_code=500, detail="Analysis failed")
        
    return review
