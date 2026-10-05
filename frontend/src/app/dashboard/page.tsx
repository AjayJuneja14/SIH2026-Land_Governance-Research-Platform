'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchDashboardSummary, fetchGISLayers, fetchGISFeatures } from '@/lib/api';
import { PuneMapClient } from '@/components/gis/PuneMapClient';
import { useChat } from '@/context/ChatContext';
import { GISLayer, GISFeature } from '@/types';
import { 
  Building2, Map, SlidersHorizontal, 
  ArrowRight, Sparkles, CheckCircle2, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [layers, setLayers] = useState<GISLayer[]>([]);
  const [features, setFeatures] = useState<GISFeature[]>([]);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([
    'layer-admin-boundaries', 'layer-urban-expansion', 'layer-water-bodies'
  ]);
  const [selectedFeature, setSelectedFeature] = useState<GISFeature | null>(null);
  const [loading, setLoading] = useState(true);

  const { toggleChat, sendMessage } = useChat();

  useEffect(() => {
    async function load() {
      const [dash, lyrs, feats] = await Promise.all([
        fetchDashboardSummary(),
        fetchGISLayers(),
        fetchGISFeatures()
      ]);
      setData(dash);
      setLayers(lyrs.layers || []);
      setFeatures(feats.features?.map((f: any) => ({
        id: f.id,
        name: f.properties.name,
        taluka: f.properties.taluka,
        category: f.properties.category,
        geometry_type: f.geometry.type,
        coordinates: f.geometry.coordinates,
        properties: f.properties,
        source: f.properties.source,
        is_demo_data: f.properties.is_demo_data
      })) || []);
      setLoading(false);
    }
    load();
  }, []);

  const toggleLayer = (layerId: string) => {
    setActiveLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const handleAskAboutFeature = async (f: GISFeature) => {
    toggleChat();
    await sendMessage(`Explain the land-use characteristics and challenges in ${f.name} (${f.taluka} Taluka).`);
  };

  const SPRAWL_DATA = [
    { year: '2010', builtup: 915, agri: 10840 },
    { year: '2014', builtup: 1420, agri: 10320 },
    { year: '2018', builtup: 2130, agri: 9650 },
    { year: '2022', builtup: 2690, agri: 9230 },
    { year: '2024', builtup: 2878, agri: 9104 },
  ];

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center space-x-2">
        <Building2 className="w-5 h-5 animate-pulse text-blue-600" />
        <span>Loading Pune Land Governance Overview...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pune Land Governance Overview
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Pune District &bull; 14 Talukas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {data.geography.scope_label} &bull; Maharashtra, India
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/ai-assistant"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Assistant</span>
          </Link>
          <Link
            href="/policy-simulator"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulate Scenario</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.kpis.map((kpi: any) => (
          <div
            key={kpi.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-[11px] font-medium text-slate-500 truncate">{kpi.title}</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{kpi.value}</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{kpi.change}</span>
              {kpi.is_demo && (
                <span className="text-amber-600 font-semibold bg-amber-50 px-1 rounded text-[9px]">Demo</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Map className="w-4 h-4 text-blue-600" />
              <span>Pune District Geospatial Intelligence Map</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any taluka or corridor to inspect land indicators and linked research citations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/gis"
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
            >
              <span>Full GIS Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {layers.map((lyr) => {
            const isActive = activeLayerIds.includes(lyr.layer_id);
            return (
              <button
                key={lyr.layer_id}
                onClick={() => toggleLayer(lyr.layer_id)}
                className={`text-xs px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lyr.color }}
                ></span>
                <span>{lyr.name}</span>
                {isActive && <CheckCircle2 className="w-3 h-3 text-blue-600 ml-1" />}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <PuneMapClient
              layers={layers}
              features={features}
              activeLayerIds={activeLayerIds}
              onToggleLayer={toggleLayer}
              selectedFeature={selectedFeature}
              onSelectFeature={setSelectedFeature}
              height="480px"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs flex flex-col justify-between space-y-3">
            {selectedFeature ? (
              <div className="space-y-3">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {selectedFeature.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedFeature.name}</h3>
                  <p className="text-slate-500 text-[11px]">{selectedFeature.taluka} Taluka, Pune</p>
                </div>

                <div className="space-y-1.5">
                  {selectedFeature.properties.area_sqkm && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Area:</span>
                      <span className="font-semibold">{selectedFeature.properties.area_sqkm} sq km</span>
                    </div>
                  )}
                  {selectedFeature.properties.population && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Population:</span>
                      <span className="font-semibold">{selectedFeature.properties.population}</span>
                    </div>
                  )}
                  {selectedFeature.properties.urban_expansion_rate && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Growth Velocity:</span>
                      <span className="font-semibold text-red-600">{selectedFeature.properties.urban_expansion_rate}</span>
                    </div>
                  )}
                  {selectedFeature.properties.dominant_land_use && (
                    <div className="text-slate-700 pt-1">
                      <span className="text-slate-500 block text-[10px]">Dominant Land Use:</span>
                      <span className="font-medium">{selectedFeature.properties.dominant_land_use}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <button
                    onClick={() => handleAskAboutFeature(selectedFeature)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI About Feature</span>
                  </button>

                  <Link
                    href={`/research?taluka=${encodeURIComponent(selectedFeature.taluka)}`}
                    className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Related Research</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center p-4 text-slate-400 space-y-2">
                <Map className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Click any polygon on the Pune map to inspect land metrics, growth velocity, and linked research.</p>
              </div>
            )}

            <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2">
              Source: PMRDA GIS &amp; Survey of India LGD Master
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pune District Land-Use &amp; Sprawl Trends</h3>
              <p className="text-xs text-slate-500">Decadal farmland conversion into built-up area (2010-2024)</p>
            </div>
            <Link href="/analytics" className="text-xs text-blue-600 font-semibold hover:underline">
              Full Analytics &rarr;
            </Link>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPRAWL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" km²" />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="builtup" name="Built-Up (sq km)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agri" name="Agriculture (sq km)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Data Source: NRSC Bhuvan ISRO LULC 2023</span>
            <span className="text-emerald-700 font-medium">Verified Public Dataset</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Pune Research &amp; Policy Papers</h3>
              <p className="text-xs text-slate-500">Peer-reviewed publications and government gazettes</p>
            </div>
            <Link href="/research" className="text-xs text-blue-600 font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {data.recent_research?.map((doc: any) => (
              <Link
                key={doc.id}
                href={`/research?doc=${doc.id}`}
                className="block p-3 rounded-lg border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-blue-700 text-[11px]">{doc.category}</span>
                  <span className="text-slate-400 text-[10px]">{doc.year} &bull; {doc.institution}</span>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {doc.title}
                </h4>
                <p className="text-slate-600 text-[11px] line-clamp-2 mt-1 leading-relaxed">
                  {doc.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>LandGov AI Decision-Support Recommendations for Pune District</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {data.ai_recommendations?.map((rec: any, idx: number) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm p-3.5 rounded-lg border border-white/10 space-y-2">
              <div className="font-semibold text-blue-200 flex items-center justify-between">
                <span>{rec.title}</span>
                <span className="text-[10px] bg-blue-800/60 px-1.5 py-0.5 rounded text-blue-300">Actionable</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{rec.description}</p>
              <div className="pt-1">
                <Link
                  href={rec.target_url}
                  className="inline-flex items-center space-x-1.5 text-white bg-blue-600 hover:bg-blue-500 font-semibold px-3 py-1 rounded text-[11px] transition-colors"
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
