'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, currentLangOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white text-xs font-semibold text-gray-700 transition shadow-sm hover:bg-emerald-50"
        aria-label="Select language"
        title="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">{currentLangOption.label}</span>
        <span className="sm:hidden">{currentLangOption.flag}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-gray-100 py-2 z-[60] overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs transition hover:bg-emerald-50 ${
                language === lang.code ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-semibold">{lang.label}</div>
                  {lang.code !== 'en' && (
                    <div className="text-[10px] text-gray-400">{lang.labelEn}</div>
                  )}
                </div>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
