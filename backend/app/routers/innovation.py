from fastapi import APIRouter
from typing import Dict, Any, List
from backend.app.data.innovation_data import INNOVATION_CHALLENGES

router = APIRouter(prefix="/api/innovation", tags=["Innovation Hub"])

@router.get("/challenges")
def list_challenges() -> Dict[str, Any]:
    return {
        "district": "Pune",
        "total_challenges": len(INNOVATION_CHALLENGES),
        "challenges": INNOVATION_CHALLENGES
    }
