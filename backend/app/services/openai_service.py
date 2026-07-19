import os
import json
from openai import OpenAI
from typing import Dict, Any

from app.core.config import settings

def get_openai_client() -> OpenAI:
    api_key = settings.MISTRAL_API_KEY
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set in .env")
    return OpenAI(
        api_key=api_key,
        base_url=settings.AI_BASE_URL
    )

def generate_ai_review(code: str, user_preferences: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Generate an AI code review using OpenAI API, adapted to user preferences.
    """
    user_preferences = user_preferences or {}
    personality = user_preferences.get('ai_personality', 'Senior Full Stack Engineer')
    mode = user_preferences.get('review_mode', 'Balanced')
    beginner_mode = user_preferences.get('beginner_mode', False)

    try:
        client = get_openai_client()
        
        beginner_prompt = "Explain concepts extremely simply as if the user is a beginner. Provide 'Explain Like I'm New' context." if beginner_mode else ""
        
        prompt = f"""
    You are acting as a {personality}. 
    Your review focus mode is: {mode}. 
    {beginner_prompt}
    
    Review the following Python code and provide a structured JSON response.
    Do NOT return markdown blocks like ```json. Return ONLY raw valid JSON.
    
    The JSON structure MUST exactly match:
    {{
        "ai_score": 8.5,
        "quality_score": 8.0,
        "security_score": 9.0,
        "performance_score": 7.5,
        "readability_score": 8.5,
        "summary": "Overall summary of the code quality.",
        "review_story": {{
            "strengths": ["...", "..."],
            "weaknesses": ["...", "..."],
            "narrative": "A cohesive 2-paragraph story describing the engineering quality of this code and next steps."
        }},
        "findings": [
            {{
                "type": "BUG",
                "severity": "HIGH",
                "impact": "High",
                "line": 42,
                "message": "Description of the bug",
                "suggestion": "How to fix it",
                "original_code": "def old_code():\\n  pass",
                "improved_code": "def new_code():\\n  pass",
                "confidence": 95,
                "confidence_reason": "Standard library misuse is deterministic.",
                "fix_time": "5 mins"
            }}
        ],
        "learning_hub": [
            {{"title": "Understanding Python Decorators", "concept": "Decorators"}}
        ],
        "best_practices": ["List of best practices followed or missed"],
        "naming_suggestions": ["Suggestions for better variable/function names"],
        "refactoring_advice": "General advice for refactoring"
    }}
    
    Here is the code to review:
    
    {code}
    """
        
        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer. Output ONLY valid JSON without markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=8000,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
            
        return json.loads(content)
        
    except Exception as e:
        return {
            "error": str(e),
            "ai_score": 0,
            "summary": f"Failed to generate AI review: {str(e)}",
            "findings": []
        }

async def chat_about_code(code: str, review_context: str, user_message: str, user_preferences: Dict[str, Any] = None) -> str:
    """
    Chat with the AI about a specific code review.
    """
    user_preferences = user_preferences or {}
    personality = user_preferences.get('ai_personality', 'Senior Full Stack Engineer')
    
    try:
        client = get_openai_client()
        
        prompt = f"""
        You are acting as a {personality}.
        The user uploaded this code:
        ```python
        {code}
        ```
        
        The AI review context for this code is:
        {review_context}
        
        The user is asking:
        "{user_message}"
        
        Respond helpfully based on the code and review context. 
        """
        
        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant embedded in a code review platform."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"I encountered an error trying to process your message: {str(e)}"

def generate_documentation(code: str) -> str:
    """
    Generate professional Markdown documentation for the given code.
    """
    
    try:
        client = get_openai_client()
        
        prompt = f"""
    You are an expert technical writer.
    Generate professional Markdown documentation for the following Python code.
    Include a high-level summary, module description, and document all functions and classes.
    
    Code:
    
    {code}
    """
        
        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": "You are an expert technical writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"# Documentation Generation Failed\n\nError: {str(e)}"
