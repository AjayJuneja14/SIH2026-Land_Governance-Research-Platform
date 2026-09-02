'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { Produce } from '../lib/types';
import ProduceCard from '../components/ProduceCard';
import PriceTransparencyWidget from '../components/PriceTransparencyWidget';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [featuredProduce, setFeaturedProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAllProduce();
        if (res.success && res.data) {
          setFeaturedProduce(res.data.slice(0, 6));
        }
      } catch (e) {
        console.error('Failed to load produce', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { nameKey: 'cat.vegetables', icon: '🥦', descKey: 'cat.vegetables.desc', name: 'Vegetables' },
    { nameKey: 'cat.fruits', icon: '🥭', descKey: 'cat.fruits.desc', name: 'Fruits' },
    { nameKey: 'cat.grains', icon: '🌾', descKey: 'cat.grains.desc', name: 'Grains' },
    { nameKey: 'cat.spices', icon: '🌶️', descKey: 'cat.spices.desc', name: 'Spices' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.2),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t('hero.titleLine1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-200">
                {t('hero.titleLine2')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mt-4">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl p-1.5 border-2 border-emerald-400/30">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow"
                >
                  {t('hero.searchButton')}
                </button>
              </div>
            </form>

            {/* Key Value Metric Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-2xl font-black text-emerald-300">100%</div>
                <div className="text-[11px] text-emerald-100 font-medium">{t('hero.directPayout')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-2xl font-black text-amber-300">0%</div>
                <div className="text-[11px] text-emerald-100 font-medium">{t('hero.middlemanMargin')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-2xl font-black text-emerald-300">3 Hubs</div>
                <div className="text-[11px] text-emerald-100 font-medium">{t('hero.localAggregation')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-2xl font-black text-green-300">Grade A</div>
                <div className="text-[11px] text-emerald-100 font-medium">{t('hero.inspectedQuality')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/marketplace?category=${cat.name}`}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition">
                  {t(cat.nameKey)}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-1">{t(cat.descKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Price Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('price.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {t('price.heading')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('price.description')}
              </p>

              <div className="space-y-2.5 text-xs text-gray-700 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t('price.farmerSetsPrice')}</strong> {t('price.farmerSetsPriceDesc')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t('price.hubFee')}</strong> {t('price.hubFeeDesc')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{t('price.consumerSaves')}</strong> {t('price.consumerSavesDesc')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {t('price.exploreFarm')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <PriceTransparencyWidget farmerPrice={30} unit="kg" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Harvest Produce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('featured.badge')}</div>
            <h2 className="text-2xl font-black text-gray-900">{t('featured.heading')}</h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            {t('featured.viewAll')} ({featuredProduce.length}+ {t('featured.items')}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProduce.map((item) => (
              <ProduceCard key={item.id} produce={item} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{t('howItWorks.badge')}</span>
          <h2 className="text-3xl font-black">{t('howItWorks.heading')}</h2>
          <p className="text-xs text-emerald-100">{t('howItWorks.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-base">1</div>
            <h3 className="font-bold text-base text-white">{t('howItWorks.step1Title')}</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">{t('howItWorks.step1Desc')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-base">2</div>
            <h3 className="font-bold text-base text-white">{t('howItWorks.step2Title')}</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">{t('howItWorks.step2Desc')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-base">3</div>
            <h3 className="font-bold text-base text-white">{t('howItWorks.step3Title')}</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">{t('howItWorks.step3Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
