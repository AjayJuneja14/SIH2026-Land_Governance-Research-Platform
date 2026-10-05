'use client';

import React, { useState } from 'react';
import { 
  Database, Search, Filter, ShieldCheck, 
  ExternalLink, Sparkles, CheckCircle2, AlertCircle, Info, Layers
} from 'lucide-react';
import { FALLBACK_DATASETS } from '@/lib/api';
import { useChat } from '@/context/ChatContext';

export default function DataSourcesPage() {
  const [datasets, setDatasets] = useState(FALLBACK_DATASETS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toggleChat, sendMessage } = useChat();

  const categories = ['All', 'Land Use / Land Cover', 'Cadastral & Land Records', 'Land Valuation & Taxation', 'Zoning & Master Plans', 'Environmental & Vulnerability'];

  const filtered = datasets.filter((d) => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchSearch = d.dataset_name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <span>Pune Land Data Sources &amp; Provenance Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verifiable data provenance catalog distinguishing verified public datasets from calibrated simulation models.
          </p>
        </div>

        <button
          onClick={() => {
            toggleChat();
            sendMessage('Explain the data provenance and collection methodology for Pune District LULC datasets.');
          }}
          className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Verify Provenance with AI</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={'text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ' + (selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets, formats, sources..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Dataset &amp; Geographic Scope</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Official Source</th>
                <th className="py-3 px-4 font-semibold">Resolution / Coverage</th>
                <th className="py-3 px-4 font-semibold">Status / Badge</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.dataset_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{d.dataset_name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{d.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{d.dataset_id} &bull; {d.geography_level}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                      {d.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {d.source}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{d.spatial_resolution}</div>
                    <div className="text-[10px] text-slate-400">{d.temporal_coverage}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {d.is_demo_data ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>[DEMO DATA]</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>[PUBLIC DATA]</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        toggleChat();
                        sendMessage('Provide schema details and citation guidelines for: ' + d.dataset_name);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center space-x-1"
                    >
                      <span>Query</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}