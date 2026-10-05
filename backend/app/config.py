import os

# Geographic Scope Hierarchy
ACTIVE_COUNTRY = os.getenv("ACTIVE_COUNTRY", "India")
ACTIVE_STATE = os.getenv("ACTIVE_STATE", "Maharashtra")
ACTIVE_DISTRICT = os.getenv("ACTIVE_DISTRICT", "Pune")

# Hierarchy of Pune District Talukas (14 Talukas)
PUNE_TALUKAS = [
    "Haveli", "Pune City", "Khed (Rajgurunagar)", "Mulshi", "Shirur", 
    "Baramati", "Daund", "Indapur", "Purandar", "Junnar", 
    "Ambegaon", "Bhor", "Velhe", "Maval"
]

# Prototype Metadata
PLATFORM_NAME = "LandGov Pune"
PLATFORM_SUBTITLE = "AI-Powered Research & Policy Innovation Platform for Land Governance"
PROTOTYPE_SCOPE_LABEL = f"Prototype Geographic Scope: {ACTIVE_DISTRICT} District, {ACTIVE_STATE}"
DEMO_DATA_DISCLOSURE = "This dataset contains demo/synthetic indicators for SIH 2026 prototype evaluation."
API_VERSION = "v1.0-SIH26019"
