'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, Download, ExternalLink, 
  Sparkles, FileText, BookmarkCheck, Calendar, User, Tag, Building2
} from 'lucide-react';
import { fetchDocuments, FALLBACK_DOCUMENTS } from '@/lib/api';
import { DocumentItem } from '@/types';
import { useChat } from '@/context/ChatContext';

const CATEGORIES = ['All', 'Research Paper', 'Policy Document', 'Case Study', 'Gazette'];

export default function ResearchHubPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(FALLBACK_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { toggleChat, sendMessage } = useChat();

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        const res = await fetchDocuments(selectedCategory, searchQuery);
        if (res?.documents && res.documents.length > 0) {
          setDocuments(res.documents);
          setSelectedDoc(res.documents[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, [selectedCategory, searchQuery]);

  const handleAskAIAboutDoc = async (doc: DocumentItem) => {
    toggleChat();
    await sendMessage('Provide a policy synthesis and key takeaways for this Pune research: ' + doc.title);
  };

  const getDocId = (doc: DocumentItem) => doc.id || doc.doc_id || doc.title;
  const getDocYear = (doc: DocumentItem) => doc.year || doc.publication_date || '2024';
  const getDocSourceUrl = (doc: DocumentItem) => doc.source_url || doc.doi_or_source_link || '#';
  const getDocInstitution = (doc: DocumentItem) => doc.institution || doc.publisher || 'Pune Land Governance Cell';
  const getDocTags = (doc: DocumentItem) => doc.tags || doc.keywords || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Pune Land Governance Research &amp; Policy Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faceted repository of 12+ peer-reviewed papers, MLRC 1966 statutory gazettes, PMRDA master plans, and cadastral pilots.
          </p>
        </div>

        <button
          onClick={() => {
            toggleChat();
            sendMessage('Summarize the latest research trends on agricultural land conversion in Pune District.');
          }}
          className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Synthesize Research with AI</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, authors, acts..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {documents.map((doc) => {
            const docId = getDocId(doc);
            const isSelected = selectedDoc && getDocId(selectedDoc) === docId;
            const tags = getDocTags(doc);

            return (
              <div
                key={docId}
                onClick={() => setSelectedDoc(doc)}
                className={'p-4 rounded-xl border cursor-pointer transition-all ' + (isSelected ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm')}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{getDocYear(doc)}</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[280px]">
                    {doc.authors}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {tags.slice(0, 2).map((k, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Document Details Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 self-start sticky top-20">
          {selectedDoc ? (
            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {selectedDoc.category}
                </span>
                <h2 className="font-bold text-base text-slate-900 leading-snug">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-slate-500">
                  By <strong>{selectedDoc.authors}</strong> &bull; {getDocInstitution(selectedDoc)} ({getDocYear(selectedDoc)})
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Executive Summary</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Findings */}
              {(selectedDoc.findings || selectedDoc.key_findings) && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Findings &amp; Outcomes</h4>
                  {selectedDoc.findings ? (
                    <p className="text-xs text-slate-700 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/80 leading-relaxed">
                      {selectedDoc.findings}
                    </p>
                  ) : (
                    <ul className="space-y-1 text-xs text-slate-700">
                      {selectedDoc.key_findings?.map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-600 font-bold">&bull;</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Relevance to Pune */}
              {selectedDoc.pune_relevance && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pune District Policy Impact</h4>
                  <p className="text-xs text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 leading-relaxed font-medium">
                    {selectedDoc.pune_relevance}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => handleAskAIAboutDoc(selectedDoc)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI to Analyze</span>
                </button>

                {getDocSourceUrl(selectedDoc) !== '#' && (
                  <a
                    href={getDocSourceUrl(selectedDoc)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                    title="Open External Source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">Select a document on the left to view complete details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}