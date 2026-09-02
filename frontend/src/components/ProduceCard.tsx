'use client';

import React from 'react';
import Link from 'next/link';
import { Produce } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import PriceTransparencyWidget from './PriceTransparencyWidget';
import { MapPin, Calendar, ShoppingCart, Check, Sparkles, UserCheck } from 'lucide-react';

interface ProduceCardProps {
  produce: Produce;
}

export default function ProduceCard({ produce }: ProduceCardProps) {
  const { addToCart, items } = useCart();
  const { t } = useLanguage();
  const isAvailable = produce.status === 'AVAILABLE' && produce.quantity > 0;
  const inCartItem = items.find((i) => i.produce.id === produce.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={produce.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
          alt={produce.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          {produce.category}
        </span>

        {/* Grade Badge */}
        <span className="absolute top-3 right-3 bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {produce.qualityGrade}
        </span>

        {/* Stock overlay if out of stock */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg shadow">
              {t('produce.soldOut')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Farmer & Location Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-1 font-medium text-emerald-800 truncate">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{produce.farmer?.name || t('produce.verifiedFarmer')}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>{produce.farmer?.location?.split(',')[0] || 'Farm'}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/produce/${produce.id}`}>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition line-clamp-1 mb-1">
              {produce.name}
            </h3>
          </Link>

          {/* Harvest Date & Stock */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {t('produce.fresh')}: {formatDate(produce.harvestDate)}
            </span>
            <span>•</span>
            <span className={produce.quantity < 50 ? 'text-amber-600 font-semibold' : 'text-gray-600'}>
              {produce.quantity} {produce.unit} {t('produce.inStock')}
            </span>
          </div>

          {/* Price Transparency Widget */}
          <div className="mb-3">
            <PriceTransparencyWidget farmerPrice={produce.pricePerUnit} unit={produce.unit} compact={true} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-gray-400 font-medium">{t('produce.directPrice')}</div>
            <div className="text-xl font-black text-gray-900 leading-tight">
              {formatCurrency(produce.pricePerUnit)}
              <span className="text-xs font-normal text-gray-500">/{produce.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/produce/${produce.id}`}
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              {t('produce.details')}
            </Link>

            {isAvailable && (
              <button
                onClick={() => addToCart(produce, 1)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm ${
                  inCartItem
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {inCartItem ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {t('produce.added')} ({inCartItem.quantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t('produce.add')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
