'use client';

import React, { useState } from 'react';
import { 
  Sliders, Play, RefreshCw, Sparkles, TrendingDown, 
  TrendingUp, ShieldCheck, ArrowRight, Layers, FileText, CheckCircle2 
} from 'lucide-react';
import { runPolicySimulation } from '@/lib/api';
import { SimulationResult, SimulationInput } from '@/types';
import { useChat } from '@/context/ChatContext';

const PRESET_SCENARIOS = [
  {
    name: '10% Peri-Urban Containment (Haveli/Mulshi Focus)',
    reduction: 10,
    agri_incentive: 15,
    green_buffer: 50,
    desc: 'Tighten Gunthewari conversion regulations and enforce agricultural green belts in high-sprawl talukas.'
  },
  {
    name: '20% Aggressive Farmland Preservation & River Buffer',
    reduction: 20,
    agri_incentive: 30,
    green_buffer: 100,
    desc: 'Strict 100m bio-shield along Mula-Mutha with transferable development rights (TDR) for farmers.'
  },
  {
    name: 'Balanced Transit-Oriented Growth along Ring Road',
    reduction: 5,
    agri_incentive: 10,
    green_buffer: 25,
    desc: 'Channel development into high-density TOD hubs while preserving surrounding agro-ecosystems.'
  }
];

export default function PolicySimulatorPage() {
  const [scenarioName, setScenarioName] = useState(PRESET_SCENARIOS[0].name);
  const [builtUpReduction, setBuiltUpReduction] = useState(10);
  const [agriIncentive, setAgriIncentive] = useState(15);
  const [greenBuffer, setGreenBuffer] = useState(50);
  const [targetYear, setTargetYear] = useState(2035);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const { toggleChat, sendMessage } = useChat();

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    try {
      const input: SimulationInput = {
        scenario_name: scenarioName,
        built_up_reduction_pct: builtUpReduction,
        agri_protection_incentive_pct: agriIncentive,
        green_buffer_meters: greenBuffer,
        target_year: targetYear
      };
      const res = await runPolicySimulation(input);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setScenarioName(preset.name);
    setBuiltUpReduction(preset.reduction);
    setAgriIncentive(preset.agri_incentive);
    setGreenBuffer(preset.green_buffer);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>Pune Land Policy &amp; Urban Growth Simulator</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate 2024–2035 land allocation, farmland preservation deltas, and flood runoff mitigation across Pune&apos;s 14 talukas.
          </p>
        </div>

        <button
          onClick={() => {
            toggleChat();
            sendMessage('Explain the scientific modeling methodology behind the Pune Land Policy Simulator.');
          }}
          className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Consult AI on Policy Tradeoffs</span>
        </button>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_SCENARIOS.map((p, idx) => (
          <div
            key={idx}
            onClick={() => applyPreset(p)}
            className={'p-3.5 rounded-xl border cursor-pointer transition-all ' + (scenarioName === p.name ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300' : 'bg-white border-slate-200 hover:border-slate-300')}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Preset {idx + 1}
              </span>
              <span className="text-xs font-bold text-blue-600">-{p.reduction}% Sprawl</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 mt-2">{p.name}</h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* 2-Column Interface: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Policy Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">Calibrate intervention thresholds</p>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slider 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Built-Up Expansion Reduction</span>
                <span className="font-bold text-blue-600">{builtUpReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={builtUpReduction}
                onChange={(e) => setBuiltUpReduction(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Controls conversion limits on peri-urban farmlands.</span>
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Agricultural Protection Subsidy</span>
                <span className="font-bold text-emerald-600">+{agriIncentive}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={agriIncentive}
                onChange={(e) => setAgriIncentive(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Incentives for farmers to retain agricultural land use.</span>
            </div>

            {/* Slider 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Riparian Green Buffer Width</span>
                <span className="font-bold text-cyan-600">{greenBuffer}m</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="10"
                value={greenBuffer}
                onChange={(e) => setGreenBuffer(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Statutory green buffer along Mula-Mutha river basin.</span>
            </div>

            {/* Target Year */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Target Projection Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2030, 2035, 2041].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTargetYear(yr)}
                    className={'py-1.5 rounded-lg border text-xs font-semibold ' + (targetYear === yr ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200')}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Simulation Matrices...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Policy Simulation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Delta KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                  <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Farmland Preserved</span>
                  <span className="text-xl font-bold text-emerald-700 mt-1 block">+{result.deltas.farmland_preserved_ha.toLocaleString()} ha</span>
                  <span className="text-[10px] text-emerald-600 mt-0.5 block">vs 2035 Baseline</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl">
                  <span className="text-[10px] text-blue-800 font-semibold block uppercase">Runoff Mitigation</span>
                  <span className="text-xl font-bold text-blue-700 mt-1 block">-{result.deltas.runoff_reduction_pct}%</span>
                  <span className="text-[10px] text-blue-600 mt-0.5 block">Flood vulnerability reduction</span>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 p-3.5 rounded-xl">
                  <span className="text-[10px] text-cyan-800 font-semibold block uppercase">Groundwater Recharge</span>
                  <span className="text-xl font-bold text-cyan-700 mt-1 block">+{result.deltas.groundwater_recharge_gain_pct}%</span>
                  <span className="text-[10px] text-cyan-600 mt-0.5 block">Aquifer percolation boost</span>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-xl">
                  <span className="text-[10px] text-purple-800 font-semibold block uppercase">Disputes Avoided</span>
                  <span className="text-xl font-bold text-purple-700 mt-1 block">-{result.deltas.disputes_avoided_count}</span>
                  <span className="text-[10px] text-purple-600 mt-0.5 block">Revenue court litigations</span>
                </div>
              </div>

              {/* Baseline vs Policy Comparison Table */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Baseline (Business as Usual) vs Policy Intervention ({result.target_year})
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Metric</th>
                        <th className="py-2 px-3 font-semibold">2035 Baseline</th>
                        <th className="py-2 px-3 font-semibold">2035 With Policy</th>
                        <th className="py-2 px-3 font-semibold text-right">Net Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-medium text-slate-800">Built-Up Area (ha)</td>
                        <td className="py-2 px-3 text-slate-600">{result.baseline_2035.built_up_area_ha.toLocaleString()}</td>
                        <td className="py-2 px-3 text-slate-900 font-bold">{result.policy_impact_2035.built_up_area_ha.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold text-right">
                          -{(result.baseline_2035.built_up_area_ha - result.policy_impact_2035.built_up_area_ha).toLocaleString()} ha
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-slate-800">Agricultural Area (ha)</td>
                        <td className="py-2 px-3 text-slate-600">{result.baseline_2035.agricultural_area_ha.toLocaleString()}</td>
                        <td className="py-2 px-3 text-slate-900 font-bold">{result.policy_impact_2035.agricultural_area_ha.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold text-right">
                          +{(result.policy_impact_2035.agricultural_area_ha - result.baseline_2035.agricultural_area_ha).toLocaleString()} ha
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-slate-800">Groundwater Stress Index</td>
                        <td className="py-2 px-3 text-slate-600">{result.baseline_2035.groundwater_stress_index} / 100</td>
                        <td className="py-2 px-3 text-slate-900 font-bold">{result.policy_impact_2035.groundwater_stress_index} / 100</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold text-right">
                          {(result.policy_impact_2035.groundwater_stress_index - result.baseline_2035.groundwater_stress_index).toFixed(1)} pts
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-slate-800">Peak Flood Runoff Index</td>
                        <td className="py-2 px-3 text-slate-600">{result.baseline_2035.peak_flood_runoff_index} / 100</td>
                        <td className="py-2 px-3 text-slate-900 font-bold">{result.policy_impact_2035.peak_flood_runoff_index} / 100</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold text-right">
                          {(result.policy_impact_2035.peak_flood_runoff_index - result.baseline_2035.peak_flood_runoff_index).toFixed(1)} pts
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Policy Insight */}
              <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h5 className="font-bold text-xs uppercase tracking-wider">AI Policy Synthesis</h5>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  {result.ai_policy_insight}
                </p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      toggleChat();
                      sendMessage('Simulate the socio-economic impact on smallholder farmers in Haveli under this scenario: ' + result.scenario_name);
                    }}
                    className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>Discuss Scenario with LandGov AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <Sliders className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">Ready to Compute Policy Impacts</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select a preset scenario or adjust the sliders on the left, then click &ldquo;Run Policy Simulation&rdquo; to model spatial and ecological transitions.
              </p>
              <button
                onClick={() => handleRunSimulation()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm inline-flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Default 10% Simulation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}