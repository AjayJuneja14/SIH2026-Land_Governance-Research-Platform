'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">{t('cart.title')}</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900">{t('cart.emptyTitle')}</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  {t('cart.emptyDesc')}
                </p>
                <Link
                  href="/marketplace"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
                >
                  {t('cart.browseButton')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map(({ produce, quantity }) => (
                <div
                  key={produce.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative group"
                >
                  <img
                    src={produce.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                    alt={produce.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{produce.name}</h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {produce.farmer?.name || 'Verified Farmer'}
                    </p>
                    <div className="text-xs font-extrabold text-emerald-700 mt-1">
                      {formatCurrency(produce.pricePerUnit)}
                      <span className="text-[10px] font-normal text-gray-500">/{produce.unit}</span>
                    </div>

                    {/* Stepper */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(produce.id, quantity - 1)}
                          className="text-gray-500 hover:text-gray-900 p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 min-w-[20px] text-center">
                          {quantity} {produce.unit}
                        </span>
                        <button
                          onClick={() => updateQuantity(produce.id, quantity + 1)}
                          disabled={quantity >= produce.quantity}
                          className="text-gray-500 hover:text-gray-900 p-0.5 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-black text-gray-900">
                        {formatCurrency(produce.pricePerUnit * quantity)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(produce.id)}
                    className="text-gray-300 hover:text-red-500 transition p-1 self-start"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.farmerPayoutSubtotal')}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.hubLogistics')}</span>
                  <span className="font-semibold text-emerald-700">{t('cart.flatRate')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('cart.estimatedTotal')}</span>
                  <span className="text-emerald-700">{formatCurrency(cartTotal + 40)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 text-xs text-gray-500 hover:text-red-600 font-medium"
                >
                  {t('cart.clear')}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md text-center flex items-center justify-center gap-2 transition"
                >
                  {t('cart.checkoutButton')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
