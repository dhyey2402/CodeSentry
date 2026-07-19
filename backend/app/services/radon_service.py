import subprocess
import json
import os
from typing import Dict, Any

def run_radon_analysis(file_path: str) -> Dict[str, Any]:
    """
    Run radon programmatically to calculate cyclomatic complexity (cc) and 
    maintainability index (mi). Returns a dictionary with these metrics.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {file_path} not found.")

    metrics = {
        "cyclomatic_complexity": "N/A",
        "maintainability_index": "N/A",
        "issues": []
    }

    # 1. Cyclomatic Complexity
    try:
        cc_cmd = ["radon", "cc", file_path, "-j"]
        cc_result = subprocess.run(cc_cmd, capture_output=True, text=True, check=False)
        cc_output = cc_result.stdout
        if cc_output:
            cc_data = json.loads(cc_output)
            file_cc_data = cc_data.get(file_path, [])
            
            # Calculate average complexity
            total_complexity = 0
            count = 0
            for item in file_cc_data:
                metrics["issues"].append({
                    "line": item.get("lineno"),
                    "type": "COMPLEXITY",
                    "symbol": item.get("type", "unknown"),
                    "message": f"{item.get('name')} has complexity {item.get('complexity')} (Rank {item.get('rank')})",
                    "message-id": "RADON-CC"
                })
                total_complexity += item.get("complexity", 0)
                count += 1
                
            if count > 0:
                avg_cc = total_complexity / count
                metrics["cyclomatic_complexity"] = f"{avg_cc:.2f}"
            else:
                metrics["cyclomatic_complexity"] = "0"
                
    except Exception as e:
        metrics["cyclomatic_complexity"] = f"Error: {str(e)}"

    # 2. Maintainability Index
    try:
        mi_cmd = ["radon", "mi", file_path, "-j"]
        mi_result = subprocess.run(mi_cmd, capture_output=True, text=True, check=False)
        mi_output = mi_result.stdout
        if mi_output:
            mi_data = json.loads(mi_output)
            file_mi = mi_data.get(file_path, {})
            metrics["maintainability_index"] = str(file_mi.get("mi", "N/A"))
            
    except Exception as e:
        metrics["maintainability_index"] = f"Error: {str(e)}"
        
    metrics["summary"] = f"Maintainability: {metrics['maintainability_index']}, Avg CC: {metrics['cyclomatic_complexity']}"

    return metrics
