from fastapi import APIRouter, Query
from typing import Dict, Any, List
from backend.app.data.datasets_data import DATASETS
from backend.app.data.documents_data import DOCUMENTS
from backend.app.data.gis_data import GIS_LAYERS, PUNE_GEOJSON_FEATURES
from backend.app.data.simulation_data import POLICY_SCENARIOS
from backend.app.data.collaboration_data import RESEARCH_PROJECTS

router = APIRouter(prefix="/api/search", tags=["AI Search"])

@router.get("")
def unified_search(q: str = Query("", description="Natural language search query")) -> Dict[str, Any]:
    query = q.lower().strip()
    if not query:
        return {
            "query": q,
            "total_matches": 0,
            "results": {
                "documents": DOCUMENTS[:3],
                "datasets": DATASETS[:3],
                "gis_layers": GIS_LAYERS[:2],
                "policy_scenarios": POLICY_SCENARIOS[:2],
                "projects": RESEARCH_PROJECTS[:2]
            }
        }

    words = [w for w in query.split() if len(w) > 2]

    def score_item(text: str) -> int:
        t = text.lower()
        score = 0
        if query in t:
            score += 10
        for w in words:
            if w in t:
                score += 2
        return score

    matched_docs = []
    for d in DOCUMENTS:
        full_text = f"{d['title']} {d['summary']} {d['category']} {' '.join(d.get('tags', []))} {d['institution']}"
        s = score_item(full_text)
        if s > 0:
            matched_docs.append((s, d))
    matched_docs.sort(key=lambda x: x[0], reverse=True)

    matched_ds = []
    for ds in DATASETS:
        full_text = f"{ds['dataset_name']} {ds['description']} {ds['category']} {ds['source_org']} {' '.join(ds.get('indicators', []))}"
        s = score_item(full_text)
        if s > 0:
            matched_ds.append((s, ds))
    matched_ds.sort(key=lambda x: x[0], reverse=True)

    matched_layers = []
    for l in GIS_LAYERS:
        full_text = f"{l['name']} {l['description']} {l['category']}"
        s = score_item(full_text)
        if s > 0:
            matched_layers.append((s, l))
    matched_layers.sort(key=lambda x: x[0], reverse=True)

    matched_scenarios = []
    for sc in POLICY_SCENARIOS:
        full_text = f"{sc['name']} {sc['description']} {sc['category']}"
        s = score_item(full_text)
        if s > 0:
            matched_scenarios.append((s, sc))
    matched_scenarios.sort(key=lambda x: x[0], reverse=True)

    matched_projects = []
    for p in RESEARCH_PROJECTS:
        full_text = f"{p['title']} {p['problem_statement']} {p['objective']} {p['research_area']}"
        s = score_item(full_text)
        if s > 0:
            matched_projects.append((s, p))
    matched_projects.sort(key=lambda x: x[0], reverse=True)

    total = len(matched_docs) + len(matched_ds) + len(matched_layers) + len(matched_scenarios) + len(matched_projects)

    return {
        "query": q,
        "total_matches": total,
        "results": {
            "documents": [d[1] for d in matched_docs],
            "datasets": [d[1] for d in matched_ds],
            "gis_layers": [l[1] for l in matched_layers],
            "policy_scenarios": [s[1] for s in matched_scenarios],
            "projects": [p[1] for p in matched_projects]
        }
    }
