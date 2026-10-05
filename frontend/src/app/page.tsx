'use client';

import React from 'react';
import Link from 'next/link';
import { useChat } from '@/context/ChatContext';
import { 
  Building2, ArrowRight, MessageSquare, Map, 
  SlidersHorizontal, FileText, Database, ShieldCheck, 
  BarChart3, Users, Lightbulb 
} from 'lucide-react';

export default function LandingPage() {
  const { toggleChat, sendMessage } = useChat();

  const handleStartStory = async () => {
    toggleChat();
    await sendMessage('What are the major land governance challenges in Pune?');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="bg-slate-900 rounded-2xl text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-950/80 border border-blue-700/60 px-3 py-1 rounded-full text-xs text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>SIH 2026 Problem Statement SIH26019 &bull; Pilot Deployment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Evidence-Based Land Governance for Pune
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            An AI-powered digital ecosystem connecting research, geospatial intelligence, 
            cadastral data, policy innovation, and decision support for Pune District, Maharashtra.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg text-xs shadow-md transition-colors flex items-center space-x-2"
            >
              <span>Explore Pune Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleStartStory}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-2.5 rounded-lg text-xs border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Ask LandGov AI</span>
            </button>

            <Link
              href="/gis"
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-2.5 rounded-lg text-xs border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <Map className="w-4 h-4 text-emerald-400" />
              <span>Explore GIS</span>
            </Link>

            <Link
              href="/policy-simulator"
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-2.5 rounded-lg text-xs border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Run Policy Simulation</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
        {[
          { label: 'RESEARCH', icon: FileText, href: '/research', color: 'text-blue-600' },
          { label: 'DATASETS', icon: Database, href: '/data-sources', color: 'text-indigo-600' },
          { label: 'AI ENGINE', icon: MessageSquare, href: '/ai-assistant', color: 'text-purple-600' },
          { label: 'GIS MAPS', icon: Map, href: '/gis', color: 'text-emerald-600' },
          { label: 'ANALYTICS', icon: BarChart3, href: '/analytics', color: 'text-cyan-600' },
          { label: 'SIMULATION', icon: SlidersHorizontal, href: '/policy-simulator', color: 'text-amber-600' },
          { label: 'COLLABORATE', icon: Users, href: '/collaboration', color: 'text-rose-600' },
        ].map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Link
              key={idx}
              href={mod.href}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${mod.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[11px] font-bold text-slate-700 tracking-wider">{mod.label}</span>
            </Link>
          );
        })}
      </section>

      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            From Scattered Information to Evidence-Based Decisions
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The core SIH26019 demonstration workflow integrates natural language inquiries, 
            geospatial validation, parametric simulation, and interdisciplinary collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              1
            </div>
            <h3 className="font-bold text-slate-800">1. Ask & Discover</h3>
            <p className="text-slate-600 text-[11px]">
              Ask natural-language questions to LandGov AI to uncover land fragmentation, 7/12 mutation data, and research papers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
              2
            </div>
            <h3 className="font-bold text-slate-800">2. Visualize in GIS</h3>
            <p className="text-slate-600 text-[11px]">
              Click &lsquo;View on Map&rsquo; to instantly isolate peri-urban pressure corridors in Haveli, Mulshi, or Mula-Mutha floodplains.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
              3
            </div>
            <h3 className="font-bold text-slate-800">3. Simulate Policy</h3>
            <p className="text-slate-600 text-[11px]">
              Test policy interventions (e.g. 10% urban expansion containment) to calculate preserved cropland and reduced flood risks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
              4
            </div>
            <h3 className="font-bold text-slate-800">4. Collaborate & Decide</h3>
            <p className="text-slate-600 text-[11px]">
              Turn simulation findings directly into active research projects with university and government planning cells.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 font-bold text-blue-900 text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span>Scalable National Digital Platform Architecture</span>
          </div>
          <p className="text-blue-800 text-xs leading-relaxed max-w-2xl">
            Pune District serves as the initial geographic pilot. The underlying data model supports 
            seamless hierarchical scaling from Pune &rarr; Maharashtra &rarr; Nationwide without modifying core code.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
        >
          Launch Prototype
        </Link>
      </section>
    </div>
  );
}
