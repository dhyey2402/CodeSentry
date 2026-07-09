import subprocess
import json
import os
from typing import Dict, Any

def run_pylint_analysis(file_path: str) -> Dict[str, Any]:
    """
    Run pylint programmatically and parse results into structured JSON.
    Returns a dictionary containing summary score, and lists of errors/warnings.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {file_path} not found.")

    # We use subprocess to execute pylint in JSON output mode.
    # Command: pylint <file_path> -f json
    cmd = ["pylint", file_path, "-f", "json"]
    
    try:
        # Pylint usually returns non-zero exit code if it finds issues,
        # so we catch the CalledProcessError and still parse its output.
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        output = result.stdout
    except Exception as e:
        return {"error": str(e), "score": 0.0, "issues": []}

    issues = []
    if output.strip():
        try:
            issues = json.loads(output)
        except json.JSONDecodeError:
            return {"error": "Failed to parse pylint output", "score": 0.0, "issues": []}

    # Extract score if available (Pylint outputs score in stdout text when using default reporter,
    # but with json reporter we have to calculate it or just return the issues.)
    # The standard pylint score formula is: 10.0 - ((float(5 * error + warning + refactor + convention) / statement) * 10)
    # Since we don't have statement count from the JSON output directly, we'll calculate a mock score based on penalty.
    
    error_count = sum(1 for i in issues if i.get("type") == "error")
    warning_count = sum(1 for i in issues if i.get("type") == "warning")
    convention_count = sum(1 for i in issues if i.get("type") == "convention")
    refactor_count = sum(1 for i in issues if i.get("type") == "refactor")
    
    # Simple score heuristic for demonstration (starts at 10, drops based on issues)
    penalty = (error_count * 1.0) + (warning_count * 0.5) + (convention_count * 0.25) + (refactor_count * 0.25)
    score = max(0.0, 10.0 - penalty)
    
    return {
        "score": round(score, 2),
        "summary": f"Found {len(issues)} issues: {error_count} Errors, {warning_count} Warnings.",
        "issues": issues
    }
