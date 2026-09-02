'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Produce } from '../../../lib/types';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { useCart } from '../../../context/CartContext';
import PriceTransparencyWidget from '../../../components/PriceTransparencyWidget';
import {
  Sprout,
  Calendar,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Check,
  ArrowLeft,
  Truck,
  Sparkles,
  Phone,
  Info,
} from 'lucide-react';

export default function ProduceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, items } = useCart();

  const [produce, setProduce] = useState<Produce | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderQty, setOrderQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduce() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getProduceById(String(id));
        if (res.success && res.data) {
          setProduce(res.data);
        }
      } catch (e) {
        console.error('Failed to load produce details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduce();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-3xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Listing Not Found</h3>
        <p className="text-xs text-gray-500">The crop listing you requested does not exist or has been removed.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const isAvailable = produce.status === 'AVAILABLE' && produce.quantity > 0;
  const inCart = items.find((i) => i.produce.id === produce.id);

  const handleAddToCart = () => {
    addToCart(produce, orderQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(produce, orderQty);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
      </Link>

      {/* Main Produce Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
            <img
              src={produce.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
              alt={produce.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">
              {produce.category}
            </span>
            <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {produce.qualityGrade}
            </span>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white p-3 rounded-2xl border border-gray-200">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Harvest Date</span>
              <strong className="text-gray-800 font-bold">{formatDate(produce.harvestDate)}</strong>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Available Stock</span>
              <strong className="text-gray-800 font-bold">{produce.quantity} {produce.unit}</strong>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Status</span>
              <strong className={produce.status === 'AVAILABLE' ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                {produce.status}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Col: Produce Details & Order Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Direct Farm Produce
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{produce.name}</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {produce.description || 'Grown with standard sustainable agricultural practices, harvested fresh and prepared for direct pickup or doorstep delivery.'}
            </p>
          </div>

          {/* Pricing Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] text-gray-500 font-semibold block">Direct Farmer Listed Price</span>
              <div className="text-3xl font-black text-emerald-700">
                {formatCurrency(produce.pricePerUnit)}
                <span className="text-xs font-medium text-gray-500"> / {produce.unit}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                100% Payout to Farmer
              </span>
            </div>
          </div>

          {/* Full Price Transparency Widget */}
          <PriceTransparencyWidget farmerPrice={produce.pricePerUnit} unit={produce.unit} />

          {/* Farmer & Hub Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {produce.farmer?.name[0] || 'F'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{produce.farmer?.name || 'Verified Farmer'}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{produce.farmer?.location || 'Nashik, Maharashtra'}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-lg border border-emerald-200">
                Verified Farmer
              </div>
            </div>

            {produce.hub && (
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Local Aggregation Hub: <strong>{produce.hub.name}</strong> ({produce.hub.location})</span>
              </div>
            )}
          </div>

          {/* Action Box */}
          {isAvailable ? (
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">Select Quantity:</span>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-300 p-1">
                  <button
                    onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-2 text-gray-900 min-w-[30px] text-center">
                    {orderQty} {produce.unit}
                  </span>
                  <button
                    onClick={() => setOrderQty(Math.min(produce.quantity, orderQty + 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60 font-semibold text-gray-800">
                <span>Total Amount:</span>
                <span className="text-base font-black text-emerald-800">
                  {formatCurrency(produce.pricePerUnit * orderQty)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-white hover:bg-gray-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-600 shadow-sm flex items-center justify-center gap-1.5 transition"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Added to Basket
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Basket
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
                >
                  Direct Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-2xl text-center text-xs text-gray-500 font-bold">
              This produce batch is currently sold out. Check back for upcoming harvest batches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
