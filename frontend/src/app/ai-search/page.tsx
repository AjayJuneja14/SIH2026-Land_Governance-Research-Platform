'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Sparkles, FileText, Database, 
  MapPin, ArrowRight, ExternalLink, ShieldCheck, Tag 
} from 'lucide-react';
import { FALLBACK_DOCUMENTS, FALLBACK_DATASETS } from '@/lib/api';
import { useChat } from '@/context/ChatContext';

export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toggleChat, sendMessage } = useChat();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const qLower = query.toLowerCase();
      const docs = FALLBACK_DOCUMENTS.filter(
        d => d.title.toLowerCase().includes(qLower) || 
             d.summary.toLowerCase().includes(qLower) ||
             d.keywords.some(k => k.toLowerCase().includes(qLower))
      );
      const data = FALLBACK_DATASETS.filter(
        d => d.dataset_name.toLowerCase().includes(qLower) || 
             d.description.toLowerCase().includes(qLower) ||
             d.tags.some(t => t.toLowerCase().includes(qLower))
      );
      setResults({
        query,
        documents: docs,
        datasets: data,
        total: docs.length + data.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleSearches = [
    'Peri-urban agricultural land conversion in Haveli',
    'MLRC 1966 Section 42 deemed NA guidelines',
    'Mula-Mutha river flood line zoning cadastre',
    '7/12 e-Mahabhumi blockchain mutation pilot',
    'PMRDA Ring Road transit oriented development'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semantic & Multi-Modal Index</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          AI Land Intelligence Search
        </h1>
        <p className="text-sm text-slate-500">
          Search across Pune District cadastral acts, spatial datasets, satellite observations, and peer-reviewed research papers.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask questions or enter search terms (e.g., Haveli farmland sprawl, Blue Line flood zoning)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center space-x-2 shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Suggested:</span>
          {sampleSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s);
                setTimeout(() => handleSearch(), 50);
              }}
              className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 transition-colors text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <p className="text-sm text-slate-600">
              Found <strong className="text-slate-900">{results.total}</strong> results for &ldquo;{results.query}&rdquo; in Pune District
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${filterType === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                All ({results.total})
              </button>
              <button
                onClick={() => setFilterType('docs')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${filterType === 'docs' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                Research ({results.documents.length})
              </button>
              <button
                onClick={() => setFilterType('datasets')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${filterType === 'datasets' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                Datasets ({results.datasets.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(filterType === 'all' || filterType === 'docs') && results.documents.map((doc: any) => (
              <div key={doc.id || doc.doc_id || doc.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400">{doc.year || doc.publication_date || '2024'}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{doc.authors}</span>
                  <button 
                    onClick={() => {
                      toggleChat();
                      sendMessage('Explain the research findings of: ' + doc.title);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>Ask AI</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {(filterType === 'all' || filterType === 'datasets') && results.datasets.map((ds: any) => (
              <div key={ds.dataset_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-medium">
                    {ds.category}
                  </span>
                  <span className="text-xs text-slate-400">{ds.spatial_resolution}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                  {ds.dataset_name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ds.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{ds.source}</span>
                  <a href="/gis" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1">
                    <span>View on Map</span>
                    <MapPin className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}