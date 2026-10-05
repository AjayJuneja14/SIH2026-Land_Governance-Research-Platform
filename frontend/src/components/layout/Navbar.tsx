'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { useChat } from '@/context/ChatContext';
import { UserRole } from '@/types';
import { 
  Building2, MessageSquare, Search, User, 
  ChevronDown, CheckCircle2 
} from 'lucide-react';

const ROLES: UserRole[] = [
  'Public User',
  'Researcher',
  'Academic',
  'Government Official',
  'Policymaker',
  'Administrator'
];

export const Navbar: React.FC = () => {
  const { role, setRole } = useRole();
  const { toggleChat } = useChat();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  LANDGOV PUNE
                </span>
                <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-blue-700/50">
                  SIH26019 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                Pune District &bull; Maharashtra, India
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/ai-search"
            className="hidden sm:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs border border-slate-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>AI Search...</span>
            <kbd className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px] border border-slate-700 font-mono">
              /
            </kbd>
          </Link>

          <button
            onClick={toggleChat}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Ask LandGov AI</span>
            <span className="md:hidden">AI</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-xs border border-slate-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                  Switch Persona / Role:
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      role === r ? 'text-blue-400 font-medium bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>{r}</span>
                    {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
