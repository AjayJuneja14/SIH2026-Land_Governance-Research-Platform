from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from backend.app.data.datasets_data import DATASETS

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("")
def get_datasets(
    category: Optional[str] = None,
    taluka: Optional[str] = None,
    is_demo: Optional[bool] = None,
    search: Optional[str] = None
) -> Dict[str, Any]:
    results = DATASETS

    if category and category != "All":
        results = [d for d in results if d["category"].lower() == category.lower()]

    if taluka and taluka != "All":
        results = [d for d in results if taluka.lower() in str(d["geography"].get("taluka", "")).lower() or "all" in str(d["geography"].get("taluka", "")).lower()]

    if is_demo is not None:
        results = [d for d in results if d["is_demo_data"] == is_demo]

    if search:
        s = search.lower()
        results = [
            d for d in results
            if s in d["dataset_name"].lower()
            or s in d["description"].lower()
            or s in d["category"].lower()
            or s in d["source_org"].lower()
        ]

    return {
        "total": len(results),
        "district": "Pune",
        "datasets": results
    }

@router.get("/{dataset_id}")
def get_dataset_by_id(dataset_id: str) -> Dict[str, Any]:
    ds = next((d for d in DATASETS if d["dataset_id"].lower() == dataset_id.lower()), None)
    if not ds:
        return {"error": "Dataset not found", "dataset_id": dataset_id}
    return {"dataset": ds}
