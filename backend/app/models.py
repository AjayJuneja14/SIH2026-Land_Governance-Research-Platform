from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GeographyScope(BaseModel):
    country: str = 'India'
    state: str = 'Maharashtra'
    district: str = 'Pune'
    taluka: Optional[str] = None
    village_or_ward: Optional[str] = None

class DatasetItem(BaseModel):
    dataset_id: str
    dataset_name: str
    description: str
    category: str
    geography: GeographyScope
    source_org: str
    source_url: str
    date: str
    last_updated: str
    data_type: str
    is_demo_data: bool
    format: str
    provenance: str
    indicators: List[str] = []

class DocumentItem(BaseModel):
    id: str
    title: str
    authors: str
    institution: str
    year: int
    category: str
    summary: str
    findings: Optional[str] = None
    tags: List[str]
    source: str
    source_url: Optional[str] = None
    pune_relevance: str
    geography: GeographyScope
    is_demo_data: bool = False

class GISFeature(BaseModel):
    id: str
    name: str
    taluka: str
    category: str
    geometry_type: str
    coordinates: Any
    properties: Dict[str, Any]
    source: str
    is_demo_data: bool

class GISLayer(BaseModel):
    layer_id: str
    name: str
    category: str
    description: str
    color: str
    default_active: bool
    feature_count: int
    is_demo_data: bool
    source: str
    features: Optional[List[GISFeature]] = None

class ResearchProject(BaseModel):
    id: str
    title: str
    problem_statement: str
    objective: str
    research_area: str
    geography: GeographyScope
    team_members: List[str]
    status: str
    linked_datasets: List[str] = []
    linked_documents: List[str] = []
    tasks: List[Dict[str, Any]] = []
    notes: Optional[str] = None
    created_at: str
    updated_at: str

class InnovationChallenge(BaseModel):
    id: str
    title: str
    category: str
    description: str
    objective: str
    target_taluka: str
    status: str
    prize_or_grant: Optional[str] = None
    deadline: str
    is_demo_challenge: bool = True

class PolicySimulationInput(BaseModel):
    scenario_id: str
    target_area: str = 'All Pune District'
    intervention_pct: float = Field(default=10.0, ge=-50.0, le=50.0)
    time_horizon_years: int = Field(default=5, ge=1, le=20)
    green_buffer_pct: float = 15.0
    transit_density_bonus: float = 1.2
    assumptions: Optional[Dict[str, Any]] = None

class SimulationMetricDiff(BaseModel):
    metric_name: str
    baseline_value: float
    scenario_value: float
    delta_value: float
    delta_pct: float
    unit: str
    direction: str

class PolicySimulationResult(BaseModel):
    simulation_id: str
    scenario_name: str
    target_area: str
    intervention_pct: float
    time_horizon_years: int
    summary: str
    metrics: List[SimulationMetricDiff]
    charts_data: List[Dict[str, Any]]
    model_assumptions: List[str]
    affected_talukas: List[str]
    disclaimer: str = 'Prototype Scenario Simulation - For Demonstration Only'

class ChatRequest(BaseModel):
    message: str
    current_route: Optional[str] = '/dashboard'
    current_context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[Dict[str, str]]] = []

class ActionButton(BaseModel):
    label: str
    action_type: str
    target_url: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

class SourceCitation(BaseModel):
    title: str
    type: str
    source_name: str
    url: Optional[str] = None
    is_demo: bool = False

class ChatResponse(BaseModel):
    answer: str
    key_points: List[str] = []
    relevant_data: List[str] = []
    relevant_research: List[str] = []
    relevant_gis_layers: List[str] = []
    sources: List[SourceCitation] = []
    action_buttons: List[ActionButton] = []
    confidence: float = 0.95
    is_demo_response: bool = False
    disclaimer: Optional[str] = None
