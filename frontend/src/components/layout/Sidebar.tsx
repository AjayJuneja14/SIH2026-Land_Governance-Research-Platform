'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Search,
  Bot,
  Map,
  BarChart3,
  SlidersHorizontal,
  Users,
  Lightbulb,
  Database
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Research Hub', href: '/research', icon: FileText },
  { name: 'AI Search', href: '/ai-search', icon: Search },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'GIS Intelligence', href: '/gis', icon: Map },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Policy Simulator', href: '/policy-simulator', icon: SlidersHorizontal },
  { name: 'Collaboration', href: '/collaboration', icon: Users },
  { name: 'Innovation Hub', href: '/innovation', icon: Lightbulb },
  { name: 'Data Sources', href: '/data-sources', icon: Database },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] text-slate-300">
      <div className="py-4 px-3">
        <div className="px-3 pb-3 mb-2 border-b border-slate-800/80 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
          Platform Modules
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px]">
          <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
            <span>Pilot Geography:</span>
            <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-700/40">
              Active
            </span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Pune District, Maharashtra &bull; 14 Talukas &bull; Multi-tier Extensible Hierarchy
          </p>
        </div>

        <div className="text-center text-[10px] text-slate-500 pt-1">
          Smart India Hackathon 2026 &bull; SIH26019
        </div>
      </div>
    </aside>
  );
};
