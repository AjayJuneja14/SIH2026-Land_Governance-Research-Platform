'use client';

import React from 'react';
import { 
  BarChart3, TrendingUp, AlertTriangle, PieChart, 
  MapPin, Sparkles, ArrowRight, ShieldAlert, Activity 
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';

const TALUKA_CONVERSION = [
  { taluka: 'Haveli', rate: 7.8, lost_ha: 4200, dispute_idx: 84 },
  { taluka: 'Mulshi', rate: 6.4, lost_ha: 2800, dispute_idx: 72 },
  { taluka: 'Khed', rate: 5.2, lost_ha: 2200, dispute_idx: 65 },
  { taluka: 'Shirur', rate: 4.6, lost_ha: 1500, dispute_idx: 54 },
  { taluka: 'Maval', rate: 4.1, lost_ha: 1300, dispute_idx: 48 },
  { taluka: 'Baramati', rate: 2.8, lost_ha: 900, dispute_idx: 36 }
];

export default function AnalyticsPage() {
  const { toggleChat, sendMessage } = useChat();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Pune Land Governance Analytics &amp; Dynamics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empirical multi-temporal satellite analytics (2014–2024), farmland conversion trajectories, and revenue litigation correlations.
          </p>
        </div>

        <button
          onClick={() => {
            toggleChat();
            sendMessage('Explain the correlation between high urban expansion rates and revenue court dispute pendency in Haveli Taluka.');
          }}
          className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Ask AI for Statistical Correlation</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Decadal Farmland Conversion</span>
          <div className="text-2xl font-bold text-slate-900">14,200 ha</div>
          <span className="text-xs text-red-600 font-medium">+6.8% Average Annual Rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Highest Pressure Taluka</span>
          <div className="text-2xl font-bold text-slate-900">Haveli (7.8%/yr)</div>
          <span className="text-xs text-amber-600 font-medium">Hadapsar, Wagholi, Loni Kalbhor</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dispute-to-Sprawl Correlation</span>
          <div className="text-2xl font-bold text-blue-600">r = 0.86</div>
          <span className="text-xs text-slate-500 font-medium">Strong statistical coupling</span>
        </div>
      </div>

      {/* Taluka Analytics Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
        <h3 className="font-bold text-sm text-slate-900">Taluka-Level Land Dynamics &amp; Dispute Indices</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Taluka Name</th>
                <th className="py-2.5 px-3 font-semibold">Annual Conversion Rate</th>
                <th className="py-2.5 px-3 font-semibold">Decadal Farmland Converted</th>
                <th className="py-2.5 px-3 font-semibold">Dispute Density Index (0-100)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TALUKA_CONVERSION.map((t) => (
                <tr key={t.taluka} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{t.taluka}</td>
                  <td className="py-3 px-3 text-red-600 font-semibold">+{t.rate}% / yr</td>
                  <td className="py-3 px-3 text-slate-700">{t.lost_ha.toLocaleString()} ha</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: t.dispute_idx + '%' }}
                        ></div>
                      </div>
                      <span className="font-medium text-slate-600">{t.dispute_idx}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        toggleChat();
                        sendMessage('Provide detailed land governance breakdown for ' + t.taluka + ' Taluka in Pune.');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs inline-flex items-center space-x-1"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3 h-3" />
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