import subprocess
import json
import os
from typing import Dict, Any

def run_bandit_analysis(file_path: str) -> Dict[str, Any]:
    """
    Run bandit programmatically and parse results into structured JSON.
    Returns a dictionary containing summary string and a list of issues.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {file_path} not found.")

    # Execute bandit in JSON output mode
    cmd = ["bandit", "-r", file_path, "-f", "json"]
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        output = result.stdout
    except Exception as e:
        return {"error": str(e), "summary": "Error running Bandit", "issues": []}

    try:
        data = json.loads(output)
    except json.JSONDecodeError:
        return {"error": "Failed to parse bandit output", "summary": "Error parsing output", "issues": []}

    results = data.get("results", [])
    metrics = data.get("metrics", {}).get("_totals", {})
    
    high = metrics.get("SEVERITY.HIGH", 0)
    medium = metrics.get("SEVERITY.MEDIUM", 0)
    low = metrics.get("SEVERITY.LOW", 0)
    
    summary = f"Found {len(results)} security issues: {high} High, {medium} Medium, {low} Low."
    
    issues = []
    for issue in results:
        issues.append({
            "line": issue.get("line_number"),
            "type": issue.get("issue_severity", "UNKNOWN").upper(),
            "symbol": issue.get("test_id", "bandit_issue"),
            "message": issue.get("issue_text", "No description"),
            "message-id": f"CWE-{issue.get('issue_cwe', {}).get('id', 'Unknown')}"
        })

    return {
        "summary": summary,
        "issues": issues
    }
