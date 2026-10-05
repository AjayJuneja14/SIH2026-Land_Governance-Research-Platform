from fastapi import APIRouter
from typing import Dict, Any
from backend.app.config import ACTIVE_COUNTRY, ACTIVE_STATE, ACTIVE_DISTRICT, PROTOTYPE_SCOPE_LABEL
from backend.app.data.datasets_data import DATASETS
from backend.app.data.documents_data import DOCUMENTS
from backend.app.data.gis_data import GIS_LAYERS, PUNE_GEOJSON_FEATURES
from backend.app.data.simulation_data import POLICY_SCENARIOS
from backend.app.data.collaboration_data import RESEARCH_PROJECTS
from backend.app.data.innovation_data import INNOVATION_CHALLENGES

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary() -> Dict[str, Any]:
    return {
        "geography": {
            "country": ACTIVE_COUNTRY,
            "state": ACTIVE_STATE,
            "district": ACTIVE_DISTRICT,
            "scope_label": PROTOTYPE_SCOPE_LABEL,
            "total_talukas": 14
        },
        "kpis": [
            {
                "id": "kpi-datasets",
                "title": "Land Governance Datasets",
                "value": len(DATASETS),
                "change": "+3 this month",
                "category": "Data Sources",
                "is_demo": False
            },
            {
                "id": "kpi-research",
                "title": "Research & Policy Documents",
                "value": len(DOCUMENTS),
                "change": "12 Verified Papers",
                "category": "Knowledge Base",
                "is_demo": False
            },
            {
                "id": "kpi-gis",
                "title": "Interactive GIS Layers",
                "value": len(GIS_LAYERS),
                "change": "100% Pune Coverage",
                "category": "Spatial Intelligence",
                "is_demo": False
            },
            {
                "id": "kpi-projects",
                "title": "Active Research Projects",
                "value": len(RESEARCH_PROJECTS),
                "change": "4 Multi-Agency Teams",
                "category": "Collaboration",
                "is_demo": False
            },
            {
                "id": "kpi-simulations",
                "title": "Policy Scenarios",
                "value": len(POLICY_SCENARIOS),
                "change": "5 Calibrated Models",
                "category": "Decision Support",
                "is_demo": False
            },
            {
                "id": "kpi-challenges",
                "title": "Innovation Challenges",
                "value": len(INNOVATION_CHALLENGES),
                "change": "SIH 2026 Open",
                "category": "Innovation Hub",
                "is_demo": True
            }
        ],
        "recent_research": DOCUMENTS[:4],
        "recent_datasets": DATASETS[:4],
        "active_projects": RESEARCH_PROJECTS[:3],
        "featured_gis_layers": GIS_LAYERS[:4],
        "ai_recommendations": [
            {
                "title": "Urban Expansion Pressure Alert",
                "description": "Satellite LULC indicates accelerated farmland conversion in Haveli & Mulshi (>6.8%/yr). Consider testing Scenario 1 in Policy Simulator.",
                "action_type": "run_simulation",
                "target_url": "/policy-simulator",
                "payload": {"scenario_id": "SCENARIO-01", "intervention_pct": 10.0}
            },
            {
                "title": "Mula-Mutha Floodplain Protection Audit",
                "description": "WRD floodline demarcation identifies 312 encroachments in Blue/Red buffer zones. Check the GIS Water Bodies layer.",
                "action_type": "activate_layer",
                "target_url": "/gis",
                "payload": {"layer_id": "layer-water-bodies"}
            }
        ]
    }
