'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GISLayer, GISFeature } from '@/types';
import { Layers, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

interface PuneMapClientProps {
  layers: GISLayer[];
  features: GISFeature[];
  activeLayerIds: string[];
  onToggleLayer: (layerId: string) => void;
  selectedFeature: GISFeature | null;
  onSelectFeature: (feature: GISFeature | null) => void;
  height?: string;
}

export const PuneMapClient: React.FC<PuneMapClientProps> = ({
  layers,
  features,
  activeLayerIds,
  onToggleLayer,
  selectedFeature,
  onSelectFeature,
  height = '600px'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 text-sm"
      >
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" />
        Loading Pune District GIS Map Engine...
      </div>
    );
  }

  const visibleFeatures = features.filter((f) => {
    if (f.category === 'Administrative Boundaries') return activeLayerIds.includes('layer-admin-boundaries');
    if (f.category === 'Urban Expansion') return activeLayerIds.includes('layer-urban-expansion');
    if (f.category === 'Water Bodies') return activeLayerIds.includes('layer-water-bodies');
    if (f.category === 'Infrastructure') return activeLayerIds.includes('layer-infrastructure');
    return true;
  });

  const getFeatureColor = (f: GISFeature) => {
    if (f.category === 'Urban Expansion') return '#ef4444';
    if (f.category === 'Water Bodies') return '#0284c7';
    if (f.category === 'Infrastructure') return '#f59e0b';
    return '#2563eb';
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibleFeatures.map((f) => {
          const color = getFeatureColor(f);
          const isSelected = selectedFeature?.id === f.id;

          if (f.geometry_type === 'LineString') {
            const positions = f.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            return (
              <Polyline
                key={f.id}
                positions={positions}
                pathOptions={{
                  color,
                  weight: isSelected ? 6 : 4,
                  dashArray: '8, 8',
                  opacity: 0.9
                }}
                eventHandlers={{
                  click: () => onSelectFeature(f)
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs font-semibold">{f.name}</div>
                  <div className="text-[10px] text-slate-500">{f.category} &bull; {f.taluka}</div>
                </Tooltip>
              </Polyline>
            );
          }

          const positions = (f.coordinates[0] || []).map((coord: [number, number]) => [coord[1], coord[0]]);
          return (
            <Polygon
              key={f.id}
              positions={positions}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: isSelected ? 0.45 : 0.2,
                weight: isSelected ? 3 : 1.5
              }}
              eventHandlers={{
                click: () => onSelectFeature(f)
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold">{f.name}</div>
                <div className="text-[10px] text-slate-500">{f.taluka} Taluka</div>
                {f.properties?.population && (
                  <div className="text-[10px] text-slate-600 font-medium">Pop: {f.properties.population}</div>
                )}
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200 text-xs max-w-xs">
        <div className="font-semibold text-slate-800 mb-1.5 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Pune GIS Layer Legend</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-blue-600 opacity-80"></span>
            <span>Taluka Administrative Boundaries</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-red-500 opacity-80"></span>
            <span>High Urban Expansion Pressure Belts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-sky-500 opacity-80"></span>
            <span>Mula-Mutha / Khadakwasla Floodplain</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-1 bg-amber-500"></span>
            <span>Pune Ring Road Corridor Alignment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuneMapClient;
