import uuid
import datetime
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.app.models import ResearchProject
from backend.app.data.collaboration_data import RESEARCH_PROJECTS

router = APIRouter(prefix="/api/collaboration", tags=["Collaboration"])

# In-memory storage for projects during session
PROJECTS_STORE: List[Dict[str, Any]] = list(RESEARCH_PROJECTS)

@router.get("/projects")
def list_projects() -> Dict[str, Any]:
    return {
        "district": "Pune",
        "total_projects": len(PROJECTS_STORE),
        "projects": PROJECTS_STORE
    }

@router.post("/projects")
def create_project(project: Dict[str, Any]) -> Dict[str, Any]:
    new_id = f"PROJ-PUN-{str(len(PROJECTS_STORE) + 1).zfill(3)}"
    now = datetime.date.today().isoformat()
    created_proj = {
        "id": new_id,
        "title": project.get("title", "New Research Project"),
        "problem_statement": project.get("problem_statement", ""),
        "objective": project.get("objective", ""),
        "research_area": project.get("research_area", "General Land Governance"),
        "geography": project.get("geography", {"country": "India", "state": "Maharashtra", "district": "Pune", "taluka": "Haveli"}),
        "team_members": project.get("team_members", ["Dr. Researcher (SPPU)"]),
        "status": project.get("status", "Idea"),
        "linked_datasets": project.get("linked_datasets", []),
        "linked_documents": project.get("linked_documents", []),
        "tasks": project.get("tasks", [
            {"title": "Initial literature and dataset review", "status": "in-progress"},
            {"title": "Field boundary and spatial GIS mapping", "status": "pending"}
        ]),
        "notes": project.get("notes", "Initiated via LandGov Pune platform."),
        "created_at": now,
        "updated_at": now
    }
    PROJECTS_STORE.insert(0, created_proj)
    return {"status": "success", "project": created_proj}

@router.get("/projects/{project_id}")
def get_project_by_id(project_id: str) -> Dict[str, Any]:
    proj = next((p for p in PROJECTS_STORE if p["id"].lower() == project_id.lower()), None)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"project": proj}

@router.patch("/projects/{project_id}/status")
def update_project_status(project_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    proj = next((p for p in PROJECTS_STORE if p["id"].lower() == project_id.lower()), None)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    if "status" in payload:
        proj["status"] = payload["status"]
        proj["updated_at"] = datetime.date.today().isoformat()
    return {"status": "success", "project": proj}
