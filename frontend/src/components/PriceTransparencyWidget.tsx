'use client';

import React, { useState } from 'react';
import { formatCurrency, calculatePriceBreakdown } from '../lib/utils';
import { TrendingUp, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface PriceTransparencyWidgetProps {
  farmerPrice: number;
  unit: string;
  compact?: boolean;
}

export default function PriceTransparencyWidget({
  farmerPrice,
  unit,
  compact = false,
}: PriceTransparencyWidgetProps) {
  const [showDetails, setShowDetails] = useState(false);
  const breakdown = calculatePriceBreakdown(farmerPrice);

  if (compact) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-xs">
        <div className="flex items-center justify-between text-emerald-950">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Price Transparency</span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5"
          >
            {showDetails ? 'Hide' : 'Breakdown'}
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-gray-700">
          <div>
            <span className="text-gray-500">Farmer Payout:</span>{' '}
            <strong className="text-emerald-700 font-bold">{formatCurrency(breakdown.farmerPrice)}/{unit}</strong>
          </div>
          <div className="text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
            Buyer saves ~{formatCurrency(breakdown.buyerSavings)}/{unit}
          </div>
        </div>

        {showDetails && (
          <div className="mt-2 pt-2 border-t border-emerald-200/60 space-y-1 text-[11px] text-gray-600 animate-in fade-in duration-150">
            <div className="flex justify-between">
              <span>Direct Farmer Share:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(breakdown.farmerPrice)} (92%)</span>
            </div>
            <div className="flex justify-between">
              <span>Platform & Quality Hub Fee:</span>
              <span className="font-semibold text-gray-900">+{formatCurrency(breakdown.platformFee)} (8%)</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t border-emerald-100">
              <span>You Pay Direct:</span>
              <span>{formatCurrency(breakdown.directConsumerPrice)}/{unit}</span>
            </div>
            <div className="flex justify-between text-gray-400 line-through text-[10px]">
              <span>Traditional Supermarket / Mandi:</span>
              <span>{formatCurrency(breakdown.traditionalRetailPrice)}/{unit}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-1.5">
              Zero-Middleman Price Transparency
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Direct Model
              </span>
            </h4>
            <p className="text-xs text-gray-500">Every rupee accounted for. Fair to farmer, cheap for consumer.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {/* Farmer share */}
        <div className="bg-white rounded-xl p-3.5 border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="text-xs text-gray-500 font-medium mb-1">Farmer Receives (Base)</div>
          <div className="text-2xl font-black text-emerald-700">
            {formatCurrency(breakdown.farmerPrice)}
            <span className="text-xs font-normal text-gray-500">/{unit}</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold inline-block">
            +{breakdown.farmerHigherSharePercent}% vs APMC Middlemen
          </div>
        </div>

        {/* Platform handling */}
        <div className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium mb-1">Hub Logistics & Inspection</div>
          <div className="text-2xl font-black text-gray-800">
            +{formatCurrency(breakdown.platformFee)}
            <span className="text-xs font-normal text-gray-500">/{unit}</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium inline-block">
            Cold chain & Hub aggregation
          </div>
        </div>

        {/* Traditional Retail Comparison */}
        <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200 shadow-sm">
          <div className="text-xs text-amber-900 font-medium mb-1">Supermarket / Retail Price</div>
          <div className="text-2xl font-black text-amber-900 line-through opacity-80">
            {formatCurrency(breakdown.traditionalRetailPrice)}
            <span className="text-xs font-normal">/{unit}</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-bold inline-block">
            Consumer Saves ~{formatCurrency(breakdown.buyerSavings)}/{unit}
          </div>
        </div>
      </div>

      <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            Direct Payout guarantee: Farmer is paid directly upon aggregation at local pickup hub.
          </span>
        </div>
      </div>
    </div>
  );
}
