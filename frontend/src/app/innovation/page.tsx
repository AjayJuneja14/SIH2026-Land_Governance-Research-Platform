'use client';

import React from 'react';
import { 
  Award, Sparkles, ArrowRight, Lightbulb, Target, 
  Coins, Calendar, Users, ShieldCheck 
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';

const CHALLENGES = [
  {
    id: 'CHALLENGE-SIH-01',
    title: 'Automated Cadastral Boundary Overlap Detection Using LISS-IV Imagery',
    theme: 'AI & Remote Sensing',
    prize: '₹1,50,000 Grant',
    deadline: '2026-11-30',
    participants: 48,
    description: 'Build automated computer vision pipelines to align historical Gunthewari boundary extracts with high-resolution satellite orthomosaics in Haveli Taluka.',
    deliverables: ['Vector polygon alignment algorithm', 'Error matrix vs DGPS Ground Truth', 'API integration with LandGov Pune']
  },
  {
    id: 'CHALLENGE-SIH-02',
    title: 'Predictive Modeling of Agricultural Farmland Fragmentation Trajectories',
    theme: 'Policy Simulation & GIS',
    prize: '₹1,00,000 Grant',
    deadline: '2026-12-15',
    participants: 34,
    description: 'Simulate the impact of proposed PMRDA Ring Road Town Planning (TP) schemes on smallholder farmland fragmentation across Pune District.',
    deliverables: ['Cellular automata transition model', 'Interactive policy parameter dashboard', 'Policy white paper']
  },
  {
    id: 'CHALLENGE-SIH-03',
    title: 'Natural Language Querying of Marathi Revenue Court Orders & 7/12 Extracts',
    theme: 'NLP & Multilingual AI',
    prize: '₹1,00,000 Grant',
    deadline: '2026-11-15',
    participants: 62,
    description: 'Develop a Marathi-to-English RAG pipeline trained on Maharashtra Land Revenue Code (MLRC 1966) judgements and Sub-Divisional Court cases.',
    deliverables: ['Marathi Indic-BERT embeddings', 'Entity extraction for survey numbers', 'Hallucination benchmark score']
  }
];

export default function InnovationHubPage() {
  const { toggleChat, sendMessage } = useChat();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>SIH 2026 Innovation Hub &amp; Grand Challenges</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Open innovation track for researchers, hackathon teams, and civic tech developers solving Pune District land governance challenges.
          </p>
        </div>

        <button
          onClick={() => {
            toggleChat();
            sendMessage('Generate innovative solution ideas for SIH 2026 Challenge: Automated Cadastral Boundary Overlap Detection.');
          }}
          className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Brainstorm Ideas with AI</span>
        </button>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CHALLENGES.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  {c.theme}
                </span>
                <span className="text-xs font-bold text-emerald-600">{c.prize}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {c.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {c.description}
              </p>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Deliverables:</span>
                <ul className="text-[11px] text-slate-600 space-y-0.5">
                  {c.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start space-x-1">
                      <span className="text-amber-500">&bull;</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {c.deadline}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{c.participants} Teams</span>
                </span>
              </div>

              <button
                onClick={() => {
                  toggleChat();
                  sendMessage('What datasets and GIS layers in LandGov Pune can be used for challenge: ' + c.title + '?');
                }}
                className="w-full bg-slate-900 hover:bg-black text-white py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Explore Datasets for Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}