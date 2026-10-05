from fastapi import APIRouter
from typing import Dict, Any, List
from backend.app.models import PolicySimulationInput, PolicySimulationResult
from backend.app.data.simulation_data import POLICY_SCENARIOS
from backend.app.services.simulation_model import run_policy_simulation

router = APIRouter(prefix="/api/policy", tags=["Policy Simulation"])

@router.get("/scenarios")
def list_scenarios() -> Dict[str, Any]:
    return {
        "district": "Pune",
        "total_scenarios": len(POLICY_SCENARIOS),
        "scenarios": POLICY_SCENARIOS
    }

@router.post("/simulate", response_model=PolicySimulationResult)
def execute_simulation(sim_input: PolicySimulationInput):
    result = run_policy_simulation(sim_input)
    return result
