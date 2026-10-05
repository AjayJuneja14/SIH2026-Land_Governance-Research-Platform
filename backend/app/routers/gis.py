from fastapi import APIRouter
from typing import Dict, Any, List
from backend.app.data.gis_data import GIS_LAYERS, PUNE_GEOJSON_FEATURES

router = APIRouter(prefix="/api/gis", tags=["GIS"])

@router.get("/layers")
def get_gis_layers() -> Dict[str, Any]:
    return {
        "district": "Pune",
        "total_layers": len(GIS_LAYERS),
        "layers": GIS_LAYERS
    }

@router.get("/features")
def get_gis_features() -> Dict[str, Any]:
    return {
        "type": "FeatureCollection",
        "district": "Pune",
        "features": [
            {
                "type": "Feature",
                "id": f["id"],
                "properties": {
                    "name": f["name"],
                    "taluka": f["taluka"],
                    "category": f["category"],
                    "source": f["source"],
                    "is_demo_data": f["is_demo_data"],
                    **f.get("properties", {})
                },
                "geometry": {
                    "type": f["geometry_type"],
                    "coordinates": f["coordinates"]
                }
            }
            for f in PUNE_GEOJSON_FEATURES
        ]
    }

@router.get("/features/{feature_id}")
def get_feature_by_id(feature_id: str) -> Dict[str, Any]:
    feat = next((f for f in PUNE_GEOJSON_FEATURES if f["id"].lower() == feature_id.lower()), None)
    if not feat:
        return {"error": "Feature not found", "id": feature_id}
    return {"feature": feat}
