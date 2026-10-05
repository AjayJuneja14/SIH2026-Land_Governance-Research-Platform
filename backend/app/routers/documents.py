from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from backend.app.data.documents_data import DOCUMENTS

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("")
def get_documents(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    year: Optional[int] = None,
    search: Optional[str] = None
) -> Dict[str, Any]:
    results = DOCUMENTS

    if category and category != "All":
        results = [d for d in results if d["category"].lower() == category.lower()]

    if tag and tag != "All":
        results = [d for d in results if any(t.lower() == tag.lower() for t in d.get("tags", []))]

    if year:
        results = [d for d in results if d["year"] == year]

    if search:
        s = search.lower()
        results = [
            d for d in results
            if s in d["title"].lower()
            or s in d["summary"].lower()
            or s in d["authors"].lower()
            or s in d["institution"].lower()
            or any(s in t.lower() for t in d.get("tags", []))
        ]

    return {
        "total": len(results),
        "district": "Pune",
        "documents": results
    }

@router.get("/{doc_id}")
def get_document_by_id(doc_id: str) -> Dict[str, Any]:
    doc = next((d for d in DOCUMENTS if d["id"].lower() == doc_id.lower()), None)
    if not doc:
        return {"error": "Document not found", "id": doc_id}
    return {"document": doc}
