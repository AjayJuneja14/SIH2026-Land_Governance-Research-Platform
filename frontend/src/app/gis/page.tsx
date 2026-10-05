'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Layers, MapPin, Eye, Info, Sparkles, Filter, 
  ChevronRight, Compass, ShieldAlert, CheckSquare, Square
} from 'lucide-react';
import { fetchGISLayers, fetchGISFeatures, FALLBACK_LAYERS, FALLBACK_FEATURES } from '@/lib/api';
import { GISLayer, GISFeature } from '@/types';
import { useChat } from '@/context/ChatContext';

const PuneMapClient = dynamic(() => import('@/components/gis/PuneMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Initializing Pune Spatial Canvas &amp; Leaflet Tiles...</p>
      </div>
    </div>
  )
});

export default function GISWorkspacePage() {
  const [layers, setLayers] = useState<GISLayer[]>(FALLBACK_LAYERS);
  const [features, setFeatures] = useState<GISFeature[]>(FALLBACK_FEATURES);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([
    'layer-admin-boundaries',
    'layer-urban-expansion',
    'layer-water-bodies',
    'layer-ring-road'
  ]);
  const [selectedFeature, setSelectedFeature] = useState<GISFeature | null>(FALLBACK_FEATURES[0]);
  const { toggleChat, sendMessage, activeLayerToHighlight } = useChat();

  useEffect(() => {
    async function loadData() {
      try {
        const [lyrRes, featRes] = await Promise.all([
          fetchGISLayers(),
          fetchGISFeatures()
        ]);
        if (lyrRes?.layers) setLayers(lyrRes.layers);
        if (featRes?.features) setFeatures(featRes.features);
      } catch (err) {
        console.error('GIS load error', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (activeLayerToHighlight && !activeLayerIds.includes(activeLayerToHighlight)) {
      setActiveLayerIds((prev) => [...prev, activeLayerToHighlight]);
    }
  }, [activeLayerToHighlight, activeLayerIds]);

  const toggleLayer = (layerId: string) => {
    setActiveLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const handleAskAboutGIS = async (f?: GISFeature) => {
    toggleChat();
    if (f) {
      await sendMessage('Explain the spatial characteristics, planning challenges, and relevant policies for ' + f.name + ' in Pune.');
    } else {
      await sendMessage('Which Pune GIS layers show the highest urban expansion pressure?');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Compass className="w-6 h-6 text-blue-600" />
            <span>Pune GIS &amp; Spatial Intelligence Workspace</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            14 Talukas &bull; PMRDA Master Plan &bull; Mula-Mutha Flood Plain &bull; Urban Growth Satellites
          </p>
        </div>

        <button
          onClick={() => handleAskAboutGIS()}
          className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Ask AI About Spatial Insights</span>
        </button>
      </div>

      {/* 3-Column GIS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Layer Manager (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-slate-700" />
              <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Map Layers</h2>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {activeLayerIds.length}/{layers.length}
            </span>
          </div>

          <div className="space-y-2">
            {layers.map((lyr) => {
              const active = activeLayerIds.includes(lyr.layer_id);
              return (
                <div
                  key={lyr.layer_id}
                  onClick={() => toggleLayer(lyr.layer_id)}
                  className={'p-2.5 rounded-lg border cursor-pointer transition-all ' + (active ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded shrink-0"
                        style={{ backgroundColor: lyr.color }}
                      ></span>
                      <span className="font-semibold text-xs leading-tight">{lyr.name}</span>
                    </div>
                    <div
                      className={'w-4 h-4 rounded flex items-center justify-center border text-[10px] ' + (active ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white')}
                    >
                      {active && '✓'}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 pl-5 line-clamp-2 leading-relaxed">
                    {lyr.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 pl-5 text-[10px]">
                    <span className="text-slate-400">{lyr.feature_count} Features</span>
                    <span className="text-slate-500 font-medium">{lyr.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Leaflet Interactive Map (6 cols) */}
        <div className="lg:col-span-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="h-[600px] w-full rounded-lg overflow-hidden border border-slate-100">
            <PuneMapClient
              layers={layers}
              features={features}
              activeLayerIds={activeLayerIds}
              onToggleLayer={toggleLayer}
              selectedFeature={selectedFeature}
              onSelectFeature={setSelectedFeature}
              height="600px"
            />
          </div>
        </div>

        {/* Right: Feature Inspector (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-2">
            <Info className="w-4 h-4 text-slate-700" />
            <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Feature Inspector</h2>
          </div>

          {selectedFeature ? (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {selectedFeature.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {selectedFeature.name}
                </h3>
                <p className="text-slate-500 text-[11px] flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Taluka: <strong>{selectedFeature.taluka}</strong></span>
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">Spatial Properties</p>
                {Object.entries(selectedFeature.properties || {}).map(([k, v]) => (
                  <div key={k} className="border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[10px] text-slate-400 block font-medium capitalize">
                      {k.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-800 font-medium text-[11px]">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleAskAboutGIS(selectedFeature)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze with LandGov AI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Click any polygon or corridor on the map to inspect properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}