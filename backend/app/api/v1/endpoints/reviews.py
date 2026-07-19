from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
import json
import os

from app.api import deps
from app.models.review import Review
from app.models.project import Project
from app.models.finding import ReviewFinding
from app.models.user import User
from app.schemas.review import Review as ReviewSchema
from app.services.pylint_service import run_pylint_analysis
from app.services.bandit_service import run_bandit_analysis
from app.services.radon_service import run_radon_analysis
from app.services.openai_service import generate_ai_review, generate_documentation

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

@router.get("/history", response_model=List[ReviewSchema])
def read_reviews_history(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve review history (same as /).
    """
    return read_reviews(db, skip, limit, current_user)

@router.get("/statistics")
def get_statistics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get aggregated statistics for the user's reviews.
    """
    reviews = (
        db.query(Review)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )
    
    if not reviews:
        return {
            "total_reviews": 0,
            "average_quality_score": 0,
            "average_maintainability": 0,
            "average_complexity": 0,
            "average_ai_score": 0
        }
        
    def safe_float(val):
        try:
            return float(val) if val and val != "N/A" else None
        except ValueError:
            return None

    scores = [safe_float(r.pylint_score) for r in reviews if safe_float(r.pylint_score) is not None]
    mis = [safe_float(r.maintainability_index) for r in reviews if safe_float(r.maintainability_index) is not None]
    ccs = [safe_float(r.cyclomatic_complexity) for r in reviews if safe_float(r.cyclomatic_complexity) is not None]
    ai_scores = [safe_float(r.ai_score) for r in reviews if safe_float(r.ai_score) is not None]
    
    return {
        "total_reviews": len(reviews),
        "average_quality_score": round(sum(scores)/len(scores), 2) if scores else 0,
        "average_maintainability": round(sum(mis)/len(mis), 2) if mis else 0,
        "average_complexity": round(sum(ccs)/len(ccs), 2) if ccs else 0,
        "average_ai_score": round(sum(ai_scores)/len(ai_scores), 2) if ai_scores else 0
    }

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

@router.delete("/{id}")
def delete_review(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a review.
    """
    review = db.query(Review).join(Project).filter(Review.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}

def get_project_and_review(db, project_id, current_user):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    if not project.file_path or not project.file_path.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only Python files (.py) are supported.")
        
    # Get or create review for this project
    review = db.query(Review).filter(Review.project_id == project.id).order_by(Review.created_at.desc()).first()
    if not review:
        review = Review(project_id=project.id, status="PROCESSING")
        db.add(review)
        db.commit()
        db.refresh(review)
        
    return project, review

@router.post("/analyze/{project_id}", response_model=ReviewSchema)
def analyze_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run static analysis (Pylint) on the uploaded project file.
    """
    project, review = get_project_and_review(db, project_id, current_user)
    
    try:
        analysis_result = run_pylint_analysis(project.file_path)
        
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
        
        review.status = "COMPLETED"
        review.pylint_score = str(analysis_result['score'])
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

@router.post("/security/{project_id}", response_model=ReviewSchema)
def analyze_security(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run static security analysis (Bandit).
    """
    project, review = get_project_and_review(db, project_id, current_user)
    
    try:
        result = run_bandit_analysis(project.file_path)
        for issue in result.get("issues", []):
            finding = ReviewFinding(
                review_id=review.id,
                file_path=project.file_path,
                line_number=issue.get("line"),
                severity=issue.get("type", "UNKNOWN").upper(),
                issue_type=issue.get("symbol", "security"),
                description=issue.get("message", "No description"),
                suggestion=f"Fix vulnerability {issue.get('message-id', '')}"
            )
            db.add(finding)
            
        review.bandit_summary = result.get("summary", "No summary")
        db.commit()
        db.refresh(review)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return review

@router.post("/complexity/{project_id}", response_model=ReviewSchema)
def analyze_complexity(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run static complexity analysis (Radon).
    """
    project, review = get_project_and_review(db, project_id, current_user)
    
    try:
        result = run_radon_analysis(project.file_path)
        for issue in result.get("issues", []):
            finding = ReviewFinding(
                review_id=review.id,
                file_path=project.file_path,
                line_number=issue.get("line"),
                severity="WARNING", # Complexity issues are warnings
                issue_type=issue.get("symbol", "complexity"),
                description=issue.get("message", "No description"),
                suggestion=f"Refactor to reduce complexity"
            )
            db.add(finding)
            
        review.maintainability_index = result.get("maintainability_index")
        review.cyclomatic_complexity = result.get("cyclomatic_complexity")
        db.commit()
        db.refresh(review)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return review

@router.post("/ai/{project_id}", response_model=ReviewSchema)
def analyze_ai(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run AI code review (OpenAI) and generate documentation.
    """
    project, review = get_project_and_review(db, project_id, current_user)
    
    try:
        with open(project.file_path, "r", encoding="utf-8") as f:
            code = f.read()
            
        result = generate_ai_review(code, current_user.preferences)
        
        findings = result.get("findings", [])
        if not isinstance(findings, list):
            findings = []
            
        for issue in findings:
            if not isinstance(issue, dict):
                continue
            severity = issue.get("severity") or "INFO"
            issue_type = issue.get("type") or "AI_SUGGESTION"
            
            finding = ReviewFinding(
                review_id=review.id,
                file_path=project.file_path,
                line_number=issue.get("line"),
                severity=str(severity).upper(),
                issue_type=str(issue_type),
                description=issue.get("message", "No description"),
                suggestion=issue.get("suggestion", ""),
                extra_data={
                    "original_code": issue.get("original_code"),
                    "improved_code": issue.get("improved_code"),
                    "impact": issue.get("impact"),
                    "confidence": issue.get("confidence"),
                    "confidence_reason": issue.get("confidence_reason"),
                    "fix_time": issue.get("fix_time")
                }
            )
            db.add(finding)
            
        review.ai_score = str(result.get("ai_score", 0))
        
        # Save structured summary
        summary_data = {
            "summary": result.get("summary", ""),
            "review_story": result.get("review_story", {}),
            "learning_hub": result.get("learning_hub", []),
            "quality_score": result.get("quality_score"),
            "security_score": result.get("security_score"),
            "performance_score": result.get("performance_score"),
            "readability_score": result.get("readability_score"),
            "best_practices": result.get("best_practices", []),
            "naming_suggestions": result.get("naming_suggestions", []),
            "refactoring_advice": result.get("refactoring_advice", "")
        }
        review.ai_summary = json.dumps(summary_data)
        
        # Generate docs
        docs = generate_documentation(code)
        review.documentation = docs
        
        db.commit()
        db.refresh(review)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return review
