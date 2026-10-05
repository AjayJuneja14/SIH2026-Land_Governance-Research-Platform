# LANDGOV PUNE
### *AI-Powered Research & Policy Innovation Platform for Land Governance*

**Smart India Hackathon 2026 Problem Statement**: SIH26019  
**Vision**: National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance  
**Prototype Geographic Scope**: **Pune District, Maharashtra, India (14 Talukas)**

---

## 🏛️ Executive Summary

Land is a finite and strategic resource critical to urban development, food security, environmental sustainability, and economic prosperity. Currently, land records, geospatial surveys, policy research, and legal disputes exist across siloed government systems.

**LANDGOV PUNE** establishes an integrated digital ecosystem connecting:
1. **Research & Policy Knowledge Base**: 12+ peer-reviewed studies and statutory gazettes.
2. **Curated Datasets & Provenance**: 15+ official & demo datasets with verifiable audit chains.
3. **Interactive GIS Intelligence**: Multi-spectral spatial layers for 14 talukas, PMRDA urban expansion zones, and Mula-Mutha floodlines.
4. **Context-Aware AI Assistant (LandGov AI)**: Source-grounded decision support with interactive action dispatch.
5. **Parametric Policy Simulator**: 5 scenario models comparing baseline trends against proposed policy interventions.
6. **Research Collaboration Workspace**: Multi-agency project lifecycle tracking from Idea &rarr; Pilot.
7. **Innovation Hub**: Open government research challenges and grants.

---

## 🗺️ Geographic Scope & Future National Scalability

All actual prototype data is strictly focused on **Pune District, Maharashtra, India**.

The system architecture implements an extensible multi-tier hierarchy:
`
Country (India)
  └── State (Maharashtra)
        └── District (Pune)
              └── 14 Talukas (Haveli, Pune City, Mulshi, Khed, Shirur, Baramati, Junnar, etc.)
                    └── Wards / Villages
                          └── GIS Features & Land Parcels
`

### Expanding to Other Districts / States:
The platform does not hard-code geographic boundaries. To scale to another district or state:
1. Update ackend/app/config.py:
   `python
   ACTIVE_COUNTRY = "India"
   ACTIVE_STATE = "Maharashtra"
   ACTIVE_DISTRICT = "Nashik" # or "Nagpur", "Thane", etc.
   `
2. Ingest the target district's GeoJSON boundaries and datasets into the seed repository. Core UI, GIS rendering, and simulation math automatically inherit the new scope.

---

## 🚀 The Main SIH Judge Demonstration Storyline

`
ASK ──► DISCOVER ──► ANALYZE ──► VISUALIZE ──► SIMULATE ──► COLLABORATE ──► DECIDE
`

1. **Ask LandGov AI**: Open floating assistant (💬 Ask LandGov AI) and ask:
   > *"What are the major land governance challenges in Pune?"*
   - AI provides structured answer with key insights, dataset references (DS-PUN-001), and research citations (DOC-PUN-001).
2. **View on Map**: Click the interactive action button **View on Map**.
   - GIS Intelligence opens with the **Urban Expansion & High Pressure Zones** layer automatically activated.
3. **Inspect GIS Feature**: Click on **Hinjawadi - Maan Tech Corridor** or **Haveli Taluka** polygon to inspect area, population, growth velocity, and linked research.
4. **Simulate Policy Scenario**: In Chatbot or Simulator, trigger:
   > *"What happens if urban expansion is reduced by 10%?"*
   - Click **Run Policy Simulation** &rarr; Policy Simulator executes Scenario 1 with 10% containment over 5 years.
   - Compares **Baseline Scenario** vs **Proposed Policy Scenario** across built-up footprint, preserved agricultural land (+42.5 sq km), and groundwater stress.
5. **Create Research Project**: Click **Create Research Project from Findings** &rarr; Generates a collaboration project in the Collaboration Workspace.
6. **Data Provenance**: Navigate to **Data Sources** &rarr; Inspect explicit [PUBLIC DATA] and [DEMO DATA] provenance chains.

---

## 💻 Technical Architecture

`
                                  ┌───────────────────────────────┐
                                  │      Next.js 14 Frontend      │
                                  │ (React, TypeScript, Tailwind) │
                                  └───────────────┬───────────────┘
                                                  │ REST API
                                  ┌───────────────▼───────────────┐
                                  │    FastAPI Python Backend     │
                                  │   (OpenAPI, Swagger Docs)     │
                                  └───────┬───────────────┬───────┘
                                          │               │
                  ┌───────────────────────▼──┐         ┌──▼──────────────────────────┐
                  │    RAG Engine & AI Core  │         │  Parametric Policy Simulator│
                  │ (Context-Aware Grounding)│         │ (Baseline vs Policy Deltas) │
                  └──────────────────────────┘         └─────────────────────────────┘
`

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn.
- **GIS**: Leaflet + OpenStreetMap tiles with GeoJSON vector polygons and lines.
- **Search & RAG**: Hybrid semantic/TF-IDF vector matching + rule-based intent recognition with zero required paid API dependencies.

---

## 🛠️ Installation & Quick Start

### 1. Backend Setup (FastAPI):
`ash
cd backend
pip install -r requirements.txt
python run.py
`
- FastAPI Backend runs on: http://localhost:8000
- Interactive OpenAPI Docs: http://localhost:8000/docs

### 2. Frontend Setup (Next.js):
`ash
cd frontend
npm install
npm run dev
`
- Web Application runs on: http://localhost:3000

---

## 📜 Compliance & Transparency Policy

- **No Fake Statistics**: All public government datasets preserve their originating source authorities (NRSC Bhuvan, PMRDA, WRD Maharashtra, MRSAC, e-Mahabhumi).
- **Clear Synthetic Badging**: All demo simulation models and sample indicators are explicitly badged with [DEMO DATA] or [SYNTHETIC DATA] disclaimers.

---
*Smart India Hackathon 2026 &bull; Problem Statement SIH26019 &bull; Built for evidence-based decision making.*