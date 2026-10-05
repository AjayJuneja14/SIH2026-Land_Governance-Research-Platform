'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { 
  MessageSquare, X, Send, Trash2, Bot, User, 
  Sparkles, MapPin, Sliders, FileText, AlertCircle, ArrowRight
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What are the major land-use challenges in Pune?',
  'Show urban expansion pressure areas',
  'What happens if urban expansion is reduced by 10%?',
  'Find research on e-Mahabhumi cadastral modernization',
  'What datasets are available for climate vulnerability?'
];

export const FloatingChatbot: React.FC = () => {
  const { isOpen, toggleChat, messages, isLoading, sendMessage, clearChat, handleActionClick } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleQuickQuestion = async (q: string) => {
    await sendMessage(q);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-xl shadow-blue-900/30 font-medium text-sm transition-all hover:scale-105 active:scale-95 border border-blue-400/30"
          aria-label="Ask LandGov AI"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600"></span>
          </div>
          <span className="font-semibold tracking-wide">Ask LandGov AI</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[440px] h-[620px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white leading-none">
                    LandGov AI Assistant
                  </h3>
                  <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-700/50">
                    Pune Grounded
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Your Pune Land Governance Decision Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {messages.length === 1 && (
            <div className="bg-slate-50 border-b border-slate-100 p-3 shrink-0">
              <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Suggested Questions for Pune:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1 mb-1 text-[10px] text-slate-400">
                  {m.sender === 'assistant' ? (
                    <>
                      <Bot className="w-3 h-3 text-blue-600" />
                      <span className="font-semibold text-slate-700">LandGov AI</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-700">You</span>
                      <User className="w-3 h-3 text-slate-500" />
                    </>
                  )}
                  <span>&bull;</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs leading-normal">{m.text}</p>

                  {m.key_points && m.key_points.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                      <div className="font-semibold text-[11px] text-slate-700">Key Insights:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                        {m.key_points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Verified Sources ({m.sources.length}):
                      </div>
                      <div className="space-y-1">
                        {m.sources.map((s, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200/80 rounded px-2 py-1 text-[10px] flex items-center justify-between text-slate-600"
                          >
                            <span className="truncate font-medium">{s.title}</span>
                            <span className="text-slate-400 text-[9px] shrink-0 ml-1">
                              {s.source_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.disclaimer && (
                    <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1 border border-amber-200 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0 text-amber-600" />
                      <span>{m.disclaimer}</span>
                    </div>
                  )}

                  {m.action_buttons && m.action_buttons.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {m.action_buttons.map((btn, bidx) => (
                        <button
                          key={bidx}
                          onClick={() => handleActionClick(btn)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded text-[11px] border border-blue-200 flex items-center space-x-1 transition-colors"
                        >
                          {btn.action_type === 'activate_layer' && <MapPin className="w-3 h-3 text-blue-600" />}
                          {btn.action_type === 'run_simulation' && <Sliders className="w-3 h-3 text-blue-600" />}
                          {btn.action_type === 'open_doc' && <FileText className="w-3 h-3 text-blue-600" />}
                          {btn.action_type === 'navigate' && <ArrowRight className="w-3 h-3 text-blue-600" />}
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-[60%]">
                <Bot className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs">Analyzing Pune land datasets...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Pune land governance..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg shadow-sm transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
