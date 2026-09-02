'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Kisan<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Direct Mandi Disintermediation
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{t('nav.marketplace')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace?category=Vegetables" className="hover:text-emerald-400 transition">
                  {t('cat.vegetables')}
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Fruits" className="hover:text-emerald-400 transition">
                  {t('cat.fruits')}
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Grains" className="hover:text-emerald-400 transition">
                  {t('cat.grains')}
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Spices" className="hover:text-emerald-400 transition">
                  {t('cat.spices')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Aggregation Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Local Aggregation Hubs</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Nashik Agro Central Hub (MH)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Pune Krishi Aggregation Center (MH)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                North Delhi Azadpur Kisan Point (DL)
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Farmer & Buyer Support</h4>
            <p className="text-xs text-gray-400 mb-2">Toll-free Kisan Helpline (Mon - Sat, 6AM - 8PM):</p>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <Phone className="w-4 h-4" /> 1800-KISAN-CONNECT
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
              <Mail className="w-3.5 h-3.5" /> support@kisanconnect.in
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} KisanConnect. All rights reserved. Built for Indian Agriculture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span className="hover:text-gray-300">Terms of Direct Trade</span>
            <span className="hover:text-gray-300">Hub Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
