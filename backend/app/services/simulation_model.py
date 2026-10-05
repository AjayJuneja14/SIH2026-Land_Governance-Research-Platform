import uuid
from typing import Dict, Any, List
from backend.app.models import PolicySimulationInput, PolicySimulationResult, SimulationMetricDiff
from backend.app.data.simulation_data import POLICY_SCENARIOS

PUNE_BASELINE = {
    'total_area_sqkm': 15643.0,
    'urban_builtup_sqkm': 2878.0,
    'agri_land_sqkm': 9104.0,
    'forest_green_sqkm': 2362.0,
    'water_bodies_sqkm': 673.0,
    'wasteland_sqkm': 626.0,
    'annual_conversion_rate_sqkm': 85.0,
    'groundwater_stress_index': 72.4,
    'impervious_runoff_index': 64.0
}

def run_policy_simulation(sim_input: PolicySimulationInput) -> PolicySimulationResult:
    scenario = next((s for s in POLICY_SCENARIOS if s['id'] == sim_input.scenario_id), None)
    if not scenario:
        scenario = {
            'id': sim_input.scenario_id,
            'name': 'Custom Land Governance Policy Scenario',
            'assumptions': ['Linear spatial reallocation based on user intervention parameters.']
        }

    pct = sim_input.intervention_pct
    years = sim_input.time_horizon_years
    sim_id = 'SIM-' + uuid.uuid4().hex[:8].upper()

    baseline_conversion = PUNE_BASELINE['annual_conversion_rate_sqkm'] * years
    base_builtup = PUNE_BASELINE['urban_builtup_sqkm'] + baseline_conversion
    base_agri = PUNE_BASELINE['agri_land_sqkm'] - baseline_conversion
    base_forest = PUNE_BASELINE['forest_green_sqkm']
    base_gw_stress = PUNE_BASELINE['groundwater_stress_index'] + (years * 0.8)
    base_runoff = PUNE_BASELINE['impervious_runoff_index'] + (years * 0.6)

    if sim_input.scenario_id == 'SCENARIO-01':
        scenario_conversion = baseline_conversion * (1.0 - (pct / 100.0))
        scen_builtup = PUNE_BASELINE['urban_builtup_sqkm'] + scenario_conversion
        scen_agri = PUNE_BASELINE['agri_land_sqkm'] - scenario_conversion
        scen_forest = base_forest + (years * 2.5)
        scen_gw_stress = base_gw_stress - (pct * 0.35)
        scen_runoff = base_runoff - (pct * 0.45)
        affected_talukas = ['Haveli', 'Mulshi', 'Khed', 'Shirur']
        diff_agri = round(base_builtup - scen_builtup, 1)
        summary = f"Applying a {pct}% containment intervention over {years} years preserves {diff_agri} sq km of prime fertile agricultural land across Pune metropolitan fringe while steering density into TOD corridors."

    elif sim_input.scenario_id == 'SCENARIO-02':
        scenario_conversion = baseline_conversion * (1.0 - (pct * 1.2 / 100.0))
        scen_builtup = PUNE_BASELINE['urban_builtup_sqkm'] + scenario_conversion
        scen_agri = PUNE_BASELINE['agri_land_sqkm'] - scenario_conversion
        scen_forest = base_forest + (years * 1.5)
        scen_gw_stress = base_gw_stress - (pct * 0.55)
        scen_runoff = base_runoff - (pct * 0.3)
        affected_talukas = ['Baramati', 'Daund', 'Indapur', 'Junnar', 'Shirur']
        saved_agri = round(scen_agri - base_agri, 1)
        summary = f"A {pct}% statutory protection on Class-I irrigated canal soils secures {saved_agri} sq km of cropland, arresting soil salinization and protecting food supply security."

    elif sim_input.scenario_id == 'SCENARIO-03':
        scenario_conversion = baseline_conversion * 0.92
        scen_builtup = PUNE_BASELINE['urban_builtup_sqkm'] + scenario_conversion - (pct * 1.8)
        scen_agri = PUNE_BASELINE['agri_land_sqkm'] - scenario_conversion
        scen_forest = base_forest + (pct * 2.8)
        scen_gw_stress = base_gw_stress - (pct * 0.6)
        scen_runoff = base_runoff - (pct * 0.85)
        affected_talukas = ['Pune City', 'Haveli', 'Mulshi', 'Velhe']
        green_add = round(scen_forest - base_forest, 1)
        summary = f"Expanding Mula-Mutha river buffer zones by {pct}% adds {green_add} sq km of protective blue-green sponge infrastructure, cutting peak monsoon runoff."

    else:
        scenario_conversion = baseline_conversion * (1.0 - (pct / 100.0))
        scen_builtup = PUNE_BASELINE['urban_builtup_sqkm'] + scenario_conversion
        scen_agri = PUNE_BASELINE['agri_land_sqkm'] - scenario_conversion
        scen_forest = base_forest + (pct * 1.2)
        scen_gw_stress = base_gw_stress - (pct * 0.3)
        scen_runoff = base_runoff - (pct * 0.4)
        affected_talukas = ['Haveli', 'Pune City', 'Mulshi', 'Khed', 'Purandar']
        saved_green = round(scen_agri - base_agri, 1)
        summary = f"Policy intervention of {pct}% across {sim_input.target_area} delivers a net conservation of {saved_green} sq km of agricultural/green land over {years} years."

    metrics = [
        SimulationMetricDiff(
            metric_name='Urban Built-Up Footprint',
            baseline_value=round(base_builtup, 1),
            scenario_value=round(scen_builtup, 1),
            delta_value=round(scen_builtup - base_builtup, 1),
            delta_pct=round(((scen_builtup - base_builtup) / base_builtup) * 100, 2),
            unit='sq km',
            direction='positive' if scen_builtup < base_builtup else 'negative'
        ),
        SimulationMetricDiff(
            metric_name='Preserved Agricultural Land',
            baseline_value=round(base_agri, 1),
            scenario_value=round(scen_agri, 1),
            delta_value=round(scen_agri - base_agri, 1),
            delta_pct=round(((scen_agri - base_agri) / base_agri) * 100, 2),
            unit='sq km',
            direction='positive' if scen_agri > base_agri else 'negative'
        ),
        SimulationMetricDiff(
            metric_name='Forest & Protected Green Cover',
            baseline_value=round(base_forest, 1),
            scenario_value=round(scen_forest, 1),
            delta_value=round(scen_forest - base_forest, 1),
            delta_pct=round(((scen_forest - base_forest) / base_forest) * 100, 2),
            unit='sq km',
            direction='positive' if scen_forest >= base_forest else 'negative'
        ),
        SimulationMetricDiff(
            metric_name='Groundwater Vulnerability Score',
            baseline_value=round(base_gw_stress, 1),
            scenario_value=round(scen_gw_stress, 1),
            delta_value=round(scen_gw_stress - base_gw_stress, 1),
            delta_pct=round(((scen_gw_stress - base_gw_stress) / base_gw_stress) * 100, 2),
            unit='Index (0-100)',
            direction='positive' if scen_gw_stress < base_gw_stress else 'negative'
        ),
        SimulationMetricDiff(
            metric_name='Impervious Surface Runoff Index',
            baseline_value=round(base_runoff, 1),
            scenario_value=round(scen_runoff, 1),
            delta_value=round(scen_runoff - base_runoff, 1),
            delta_pct=round(((scen_runoff - base_runoff) / base_runoff) * 100, 2),
            unit='Index (0-100)',
            direction='positive' if scen_runoff < base_runoff else 'negative'
        )
    ]

    charts_data = []
    for y in range(0, years + 1):
        step_base_built = PUNE_BASELINE['urban_builtup_sqkm'] + (PUNE_BASELINE['annual_conversion_rate_sqkm'] * y)
        step_base_agri = PUNE_BASELINE['agri_land_sqkm'] - (PUNE_BASELINE['annual_conversion_rate_sqkm'] * y)
        step_scen_conv = (PUNE_BASELINE['annual_conversion_rate_sqkm'] * (1.0 - (pct / 100.0))) * y
        step_scen_built = PUNE_BASELINE['urban_builtup_sqkm'] + step_scen_conv
        step_scen_agri = PUNE_BASELINE['agri_land_sqkm'] - step_scen_conv

        charts_data.append({
            'year_offset': 'Year +' + str(y),
            'baseline_builtup': round(step_base_built, 1),
            'scenario_builtup': round(step_scen_built, 1),
            'baseline_agri': round(step_base_agri, 1),
            'scenario_agri': round(step_scen_agri, 1)
        })

    return PolicySimulationResult(
        simulation_id=sim_id,
        scenario_name=scenario['name'],
        target_area=sim_input.target_area,
        intervention_pct=pct,
        time_horizon_years=years,
        summary=summary,
        metrics=metrics,
        charts_data=charts_data,
        model_assumptions=scenario.get('assumptions', ['Prototype mathematical land allocation model.']),
        affected_talukas=affected_talukas,
        disclaimer='Prototype Scenario Simulation - For Demonstration Only'
    )