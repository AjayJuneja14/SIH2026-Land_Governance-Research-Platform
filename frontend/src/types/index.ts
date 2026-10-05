export type UserRole = 
  | 'Public User'
  | 'Researcher'
  | 'Academic'
  | 'Government Official'
  | 'Policymaker'
  | 'Administrator';

export interface GeographyScope {
  country: string;
  state: string;
  district: string;
  taluka?: string;
  village_or_ward?: string;
}

export interface DatasetItem {
  dataset_id: string;
  dataset_name: string;
  description: string;
  category: string;
  geography?: GeographyScope | string;
  geography_level?: string;
  source?: string;
  source_org?: string;
  source_url?: string;
  date?: string;
  last_updated?: string;
  data_type?: string;
  is_demo_data: boolean;
  format?: string;
  provenance?: string;
  indicators?: string[];
  tags?: string[];
  records_count?: number;
  spatial_resolution?: string;
  temporal_coverage?: string;
  update_frequency?: string;
}

export interface DocumentItem {
  id?: string;
  doc_id?: string;
  title: string;
  authors: string;
  institution?: string;
  publisher?: string;
  year?: number;
  publication_date?: string;
  category: string;
  summary: string;
  findings?: string;
  key_findings?: string[];
  policy_implications?: string[];
  tags?: string[];
  keywords?: string[];
  source?: string;
  doi_or_source_link?: string;
  source_url?: string;
  pune_relevance?: string;
  geography?: GeographyScope | string;
  is_demo_data: boolean;
}

export interface GISFeature {
  id?: string;
  feature_id?: string;
  layer_id?: string;
  name: string;
  taluka: string;
  category: string;
  geometry_type: string;
  coordinates: any;
  properties: Record<string, any>;
  source: string;
  is_demo_data: boolean;
}

export interface GISLayer {
  layer_id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  default_active?: boolean;
  opacity?: number;
  feature_count: number;
  is_demo_data: boolean;
  source: string;
  features?: GISFeature[];
}

export interface ResearchProject {
  id: string;
  title: string;
  problem_statement?: string;
  objective?: string;
  research_area?: string;
  lead_agency?: string;
  members_count?: number;
  geography?: GeographyScope | string;
  team_members?: string[];
  status: string;
  deadline?: string;
  linked_datasets?: string[];
  linked_documents?: string[];
  tasks?: Array<{ title: string; status: 'completed' | 'in-progress' | 'pending' }>;
  notes?: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export type ProjectItem = ResearchProject;

export interface InnovationChallenge {
  id: string;
  title: string;
  category?: string;
  theme?: string;
  description: string;
  objective?: string;
  target_taluka?: string;
  status?: string;
  prize?: string;
  prize_or_grant?: string;
  deadline: string;
  participants?: number;
  deliverables?: string[];
  is_demo_challenge?: boolean;
}

export interface SimulationMetricDiff {
  metric_name: string;
  baseline_value: number;
  scenario_value: number;
  delta_value: number;
  delta_pct: number;
  unit: string;
  direction: string;
}

export interface PolicySimulationInput {
  scenario_id?: string;
  scenario_name?: string;
  target_area?: string;
  intervention_pct?: number;
  time_horizon_years?: number;
  built_up_reduction_pct?: number;
  agri_protection_incentive_pct?: number;
  green_buffer_meters?: number;
  target_year?: number;
}

export type SimulationInput = PolicySimulationInput;

export interface PolicySimulationResult {
  simulation_id: string;
  scenario_name: string;
  target_area?: string;
  intervention_pct?: number;
  time_horizon_years?: number;
  target_year?: number;
  summary?: string;
  ai_policy_insight?: string;
  metrics?: SimulationMetricDiff[];
  charts_data?: Array<{
    year_offset: string;
    baseline_builtup: number;
    scenario_builtup: number;
    baseline_agri: number;
    scenario_agri: number;
  }>;
  baseline_2035?: {
    built_up_area_ha: number;
    agricultural_area_ha: number;
    forest_green_cover_ha: number;
    groundwater_stress_index: number;
    peak_flood_runoff_index: number;
    projected_dispute_volume: number;
  };
  policy_impact_2035?: {
    built_up_area_ha: number;
    agricultural_area_ha: number;
    forest_green_cover_ha: number;
    groundwater_stress_index: number;
    peak_flood_runoff_index: number;
    projected_dispute_volume: number;
  };
  deltas?: {
    farmland_preserved_ha: number;
    runoff_reduction_pct: number;
    groundwater_recharge_gain_pct: number;
    disputes_avoided_count: number;
  };
  taluka_breakdown?: Array<{
    taluka: string;
    baseline_loss_ha: number;
    policy_loss_ha: number;
    preserved_ha: number;
  }>;
  model_assumptions?: string[];
  affected_talukas?: string[];
  disclaimer?: string;
}

export type SimulationResult = PolicySimulationResult;

export interface ActionButton {
  label: string;
  action_type: string;
  target_url?: string;
  payload?: Record<string, any>;
}

export type ChatAction = ActionButton;

export interface SourceCitation {
  title: string;
  type: string;
  source_name?: string;
  id?: string;
  url?: string;
  is_demo?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  key_points?: string[];
  relevant_data?: string[];
  relevant_research?: string[];
  relevant_gis_layers?: string[];
  sources?: SourceCitation[];
  action_buttons?: ActionButton[];
  actions?: ActionButton[];
  timestamp: string;
  confidence?: number;
  is_demo_response?: boolean;
  disclaimer?: string;
}

export interface ChatQueryResponse {
  answer: string;
  key_points?: string[];
  relevant_data?: string[];
  relevant_research?: string[];
  relevant_gis_layers?: string[];
  sources?: SourceCitation[];
  action_buttons?: ActionButton[];
  actions?: ActionButton[];
  confidence?: number;
  is_demo_response?: boolean;
  disclaimer?: string;
}