from fastapi import APIRouter
from typing import Dict, Any
from backend.app.data.analytics_data import ANALYTICS_DATA

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/pune-overview")
def get_analytics_overview() -> Dict[str, Any]:
    return {
        "district": "Pune",
        "state": "Maharashtra",
        "scope_disclaimer": "District-level aggregated statistical indicators for Pune.",
        "data": ANALYTICS_DATA
    }
