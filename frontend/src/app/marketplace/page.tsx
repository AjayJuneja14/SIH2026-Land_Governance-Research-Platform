'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';
import { Produce } from '../../lib/types';
import ProduceCard from '../../components/ProduceCard';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  ArrowUpDown,
} from 'lucide-react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const { t } = useLanguage();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('harvest_recent');

  const categories = [
    { key: 'ALL', label: t('cat.all') },
    { key: 'Vegetables', label: t('cat.vegetables') },
    { key: 'Fruits', label: t('cat.fruits') },
    { key: 'Grains', label: t('cat.grains') },
    { key: 'Pulses', label: t('cat.pulses') },
    { key: 'Spices', label: t('cat.spices') },
    { key: 'Dairy', label: t('cat.dairy') },
  ];

  const locations = [
    { key: '', label: t('market.allLocations') },
    { key: 'Nashik', label: 'Nashik' },
    { key: 'Pune', label: 'Pune' },
    { key: 'Karnal', label: 'Karnal' },
    { key: 'Shimla', label: 'Shimla' },
    { key: 'Guntur', label: 'Guntur' },
    { key: 'Ratnagiri', label: 'Ratnagiri' },
    { key: 'Noida', label: 'Noida' },
  ];

  useEffect(() => {
    fetchProduce();
  }, [selectedCategory, selectedLocation, selectedGrade, maxPrice, sortBy]);

  const fetchProduce = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        sortBy,
      };

      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;
      if (selectedGrade && selectedGrade !== 'ALL') params.qualityGrade = selectedGrade;
      if (maxPrice !== '') params.maxPrice = String(maxPrice);

      const res = await api.getAllProduce(params);
      if (res.success && res.data) {
        setProduceList(res.data);
      }
    } catch (e) {
      console.error('Error fetching produce:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProduce();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedLocation('');
    setSelectedGrade('ALL');
    setMaxPrice('');
    setSortBy('harvest_recent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            {t('market.catalogBadge')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{t('market.title')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
            {t('market.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
          <span className="font-bold text-emerald-200">{produceList.length}</span> {t('market.activeListings')}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.key === 'ALL' ? `🌾 ${cat.label}` : cat.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-4 relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('market.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </form>

          {/* Location Filter */}
          <div className="md:col-span-3 flex items-center relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-gray-700"
            >
              {locations.map((loc) => (
                <option key={loc.key} value={loc.key}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div className="md:col-span-3 flex items-center relative">
            <Tag className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-gray-700"
            >
              <option value="ALL">{t('market.allGrades')}</option>
              <option value="Grade A">{t('market.gradeA')}</option>
              <option value="Organic Certified">{t('market.organic')}</option>
              <option value="Grade B">{t('market.gradeB')}</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="md:col-span-2 flex items-center relative">
            <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-gray-700"
            >
              <option value="harvest_recent">{t('market.recentHarvest')}</option>
              <option value="price_asc">{t('market.priceLowHigh')}</option>
              <option value="price_desc">{t('market.priceHighLow')}</option>
            </select>
          </div>
        </div>

        {/* Active filters & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>{t('market.showingListings')} ({produceList.length})</span>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('market.resetFilters')}
          </button>
        </div>
      </div>

      {/* Produce Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : produceList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">{t('market.noProduceFound')}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {t('market.noProduceDesc')}
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
          >
            {t('market.clearAllFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produceList.map((produce) => (
            <ProduceCard key={produce.id} produce={produce} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
