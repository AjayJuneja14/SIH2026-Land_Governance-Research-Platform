'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { 
  Bot, User, Send, Trash2, Sparkles, MapPin, 
  Sliders, FileText, ArrowRight, ShieldCheck, 
  AlertCircle, HelpCircle, CheckCircle2 
} from 'lucide-react';

const QUICK_PROMPTS = [
  'What are the major land governance challenges in Pune?',
  'Show urban expansion pressure areas on the map',
  'What happens if urban expansion is reduced by 10%?',
  'Find research on e-Mahabhumi cadastral modernization',
  'What datasets are available for climate vulnerability?',
  'Explain Mula-Mutha river flood line zoning'
];

export default function AIAssistantPage() {
  const { messages, isLoading, sendMessage, clearChat, handleActionClick } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input;
    setInput('');
    await sendMessage(q);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-900 leading-none">LandGov AI Assistant</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Pune District Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evidence-based natural language assistant with verifiable data citations and actionable workflow links.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 overflow-y-auto space-y-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={'flex items-start space-x-3 ' + (m.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={'rounded-2xl p-4 max-w-[82%] space-y-3 ' + (m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none text-sm' : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-200 text-xs')}
            >
              <div className="leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>

              {/* Key Bullet Points */}
              {m.key_points && m.key_points.length > 0 && (
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-[11px] text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Evidence-Based Takeaways:</span>
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    {m.key_points.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 text-[11px]">
                        <span className="text-blue-600 font-bold">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {m.sources && m.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                    Citations:
                  </span>
                  {m.sources.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-700 border border-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                    >
                      [{s.type.toUpperCase()}] {s.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {(m.action_buttons || m.actions) && (m.action_buttons || m.actions)!.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {(m.action_buttons || m.actions)!.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(act)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
                    >
                      {(act.action_type === 'navigate_gis' || act.action_type === 'activate_layer') && <MapPin className="w-3.5 h-3.5" />}
                      {(act.action_type === 'navigate_simulation' || act.action_type === 'run_simulation') && <Sliders className="w-3.5 h-3.5" />}
                      {(act.action_type === 'open_research' || act.action_type === 'open_doc') && <FileText className="w-3.5 h-3.5" />}
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2.5 text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-w-[60%]">
            <Bot className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Consulting Pune District knowledge graph...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 px-1 shrink-0">
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1 rounded-lg border border-slate-200 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Pune land governance, GIS layers, or policy simulations..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}