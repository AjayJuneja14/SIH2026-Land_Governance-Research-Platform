'use client';

import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Sparkles, 
  Clock, CheckCircle, AlertCircle, FileText, ArrowRight 
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';

const SAMPLE_PROJECTS = [
  {
    id: 'PROJ-PUNE-01',
    title: 'Pune Peri-Urban Farmland Preservation & Gunthewari Mitigation Framework',
    lead_agency: 'COEP Technological University & PMRDA Planning Directorate',
    members_count: 8,
    status: 'In Progress',
    deadline: '2026-12-31',
    description: 'Developing automated satellite alert pipelines for detecting unauthorized sub-divisions and recommending Transferable Development Rights (TDR) corridors.',
    tags: ['Peri-Urban', 'TDR', 'Gunthewari', 'Haveli']
  },
  {
    id: 'PROJ-PUNE-02',
    title: 'e-Mahabhumi 7/12 Cryptographic Mutation Verification Pilot',
    lead_agency: 'District Collectorate Pune & NIC Land Records Division',
    members_count: 12,
    status: 'Review',
    deadline: '2026-08-15',
    description: 'Evaluating tamper-evident blockchain transaction verification for Sub-Divisional Revenue Courts to eliminate inheritance litigation delays.',
    tags: ['Blockchain', '7/12 RoR', 'Revenue Court', 'MLRC']
  },
  {
    id: 'PROJ-PUNE-03',
    title: 'Mula-Mutha River Basin Floodplain Encroachment Cadastre',
    lead_agency: 'Water Resources Department (Irrigation) & PMC Town Planning',
    members_count: 6,
    status: 'Active',
    deadline: '2027-03-31',
    description: 'Mapping 2,100 surveyed structures inside the prohibitive Blue Line flood hazard corridor against official cadastral survey sheets.',
    tags: ['Blue Line', 'Flood Hazard', 'Riverfront', 'Cadastre']
  }
];

export default function CollaborationPage() {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAgency, setNewAgency] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const { toggleChat, sendMessage } = useChat();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const p = {
      id: 'PROJ-PUNE-' + (projects.length + 1).toString().padStart(2, '0'),
      title: newTitle,
      lead_agency: newAgency || 'Pune Research Collaborative',
      members_count: 1,
      status: 'Proposed',
      deadline: '2027-01-01',
      description: newDesc,
      tags: ['Pune', 'Policy', 'Research']
    };
    setProjects([p, ...projects]);
    setShowModal(false);
    setNewTitle('');
    setNewAgency('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Pune Research Collaboration &amp; Working Groups</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Joint multi-agency working groups bridging academia (COEP, SPPU), district revenue administration, and PMRDA town planners.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Propose Research Project</span>
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {proj.status}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Due {proj.deadline}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {proj.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {proj.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium truncate max-w-[200px]">{proj.lead_agency}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">{proj.members_count} Members</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    toggleChat();
                    sendMessage('Analyze literature and policy gaps for research project: ' + proj.title);
                  }}
                  className="w-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Workgroup Assistant</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Propose New Research Working Group</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-driven cadastral dispute clustering in Shirur taluka"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Lead Agency / University</label>
                <input
                  type="text"
                  required
                  value={newAgency}
                  onChange={(e) => setNewAgency(e.target.value)}
                  placeholder="e.g. COEP Technological University"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Executive Description &amp; Objectives</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly state data sources required and intended policy impact..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}