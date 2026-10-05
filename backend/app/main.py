from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import (
    PLATFORM_NAME, PLATFORM_SUBTITLE, PROTOTYPE_SCOPE_LABEL,
    ACTIVE_COUNTRY, ACTIVE_STATE, ACTIVE_DISTRICT, API_VERSION
)
from backend.app.routers import (
    dashboard, datasets, documents, gis, analytics,
    simulation, collaboration, innovation, search, chat
)

app = FastAPI(
    title=PLATFORM_NAME,
    description=f"{PLATFORM_SUBTITLE}\n\n**{PROTOTYPE_SCOPE_LABEL}**\n\nSIH 2026 Problem Statement SIH26019: National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance.",
    version=API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Frontend Dev Server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(dashboard.router)
app.include_router(datasets.router)
app.include_router(documents.router)
app.include_router(gis.router)
app.include_router(analytics.router)
app.include_router(simulation.router)
app.include_router(collaboration.router)
app.include_router(innovation.router)
app.include_router(search.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {
        "platform": PLATFORM_NAME,
        "subtitle": PLATFORM_SUBTITLE,
        "scope": PROTOTYPE_SCOPE_LABEL,
        "geography": {
            "country": ACTIVE_COUNTRY,
            "state": ACTIVE_STATE,
            "district": ACTIVE_DISTRICT
        },
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "scope": ACTIVE_DISTRICT}
