import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

export const ScopeBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold tracking-wide text-white uppercase text-[11px]">
          Prototype Geographic Scope:
        </span>
        <span className="text-amber-300 font-medium flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
          Pune District, Maharashtra (14 Talukas)
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-4 text-[11px] text-slate-400">
        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
          Active Hierarchy: India &rarr; Maharashtra &rarr; Pune
        </span>
        <span className="flex items-center text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          SIH26019 Pilot Architecture
        </span>
      </div>
    </div>
  );
};
