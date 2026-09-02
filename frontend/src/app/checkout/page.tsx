'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/api';
import { Hub } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import {
  ShoppingBag,
  Truck,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Building2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();

  const [deliveryType, setDeliveryType] = useState<'DOORSTEP' | 'HUB_PICKUP'>('DOORSTEP');
  const [address, setAddress] = useState(user?.location || 'Flat 402, Green Acre Heights, Kothrud, Pune - 411038');
  const [selectedHubId, setSelectedHubId] = useState('');
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderIds, setCreatedOrderIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAllHubs().then((res) => {
      if (res.success && res.data) {
        setHubs(res.data);
        if (res.data.length > 0) setSelectedHubId(res.data[0].id);
      }
    });
  }, []);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-3xl border border-gray-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Your Basket is Empty</h3>
        <p className="text-xs text-gray-500">Please add items from the marketplace before checking out.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in or select a demo buyer account first to place an order.');
      return;
    }

    if (deliveryType === 'DOORSTEP' && !address.trim()) {
      setError('Please provide a complete delivery address.');
      return;
    }

    try {
      setLoading(true);
      const placedIds: string[] = [];

      for (const item of items) {
        const payload = {
          produceId: item.produce.id,
          quantity: item.quantity,
          deliveryAddress: deliveryType === 'DOORSTEP' ? address : `Hub Pickup at: ${hubs.find(h => h.id === selectedHubId)?.name || 'Selected Hub'}`,
          hubId: selectedHubId || item.produce.hubId || undefined,
          paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
          notes: notes || undefined,
        };

        const res = await api.createOrder(payload);
        if (res.success && res.data) {
          placedIds.push(res.data.id);
        } else {
          throw new Error(res.message || 'Failed to place order for ' + item.produce.name);
        }
      }

      setCreatedOrderIds(placedIds);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Failed to complete order. Please check available stock.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-gray-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed & Logged
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Thank You for Supporting Indian Farmers!</h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your direct harvest order has been routed to the local aggregation hub. 
            The farmer has been notified and 100% of the produce payment is secured for payout.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2 text-left max-w-md mx-auto">
          <div className="flex justify-between font-bold">
            <span>Orders Placed:</span>
            <span>{createdOrderIds.length} item(s)</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Payment Method:</span>
            <span className="font-semibold text-gray-800">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Dispatch Timeline:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Within 24-48 Hours
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Track in My Orders
          </Link>
          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlingFee = 40;
  const grandTotal = cartTotal + handlingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Delivery Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Delivery & Pickup Preferences</h2>
                <p className="text-xs text-gray-500">Choose doorstep delivery or self-pickup from local hub</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Delivery Type Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('DOORSTEP')}
                className={`p-4 rounded-2xl border text-left transition ${
                  deliveryType === 'DOORSTEP'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Doorstep Delivery
                </div>
                <p className="text-[11px] text-gray-500">Direct courier from local aggregation hub to your home</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('HUB_PICKUP')}
                className={`p-4 rounded-2xl border text-left transition ${
                  deliveryType === 'HUB_PICKUP'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Local Hub Pickup
                </div>
                <p className="text-[11px] text-gray-500">Collect directly from local Kisan Hub & save time</p>
              </button>
            </div>

            {/* Delivery Details */}
            {deliveryType === 'DOORSTEP' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800">
                  Full Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Street, Building name, Flat number, Area, City, Pin Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800">
                  Select Collection Hub <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedHubId}
                  onChange={(e) => setSelectedHubId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-gray-800"
                >
                  {hubs.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} — {hub.location} (Phone: {hub.contactNumber || 'Available'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-800">Payment Option</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-emerald-600"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                    paymentMethod === 'ONLINE'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="accent-emerald-600"
                  />
                  <span>UPI / Net Banking (Instant)</span>
                </label>
              </div>
            </div>

            {/* Buyer Contact Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[11px]">Ordering As:</span>
                <strong className="text-gray-900">{user ? user.name : 'Guest (Please Sign In)'}</strong>
                <span className="text-gray-500 block text-[11px]">{user?.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  Verified Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Breakdown ({items.length} crops)
            </h3>

            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto space-y-2">
              {items.map(({ produce, quantity }) => (
                <div key={produce.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate max-w-[220px]">
                    <img
                      src={produce.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                      alt={produce.name}
                      className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-gray-900 truncate">{produce.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {quantity} {produce.unit} × {formatCurrency(produce.pricePerUnit)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(produce.pricePerUnit * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Farmer Direct Share:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hub Quality & Handling:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(handlingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Price Transparency Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Direct Payout Model:</strong> {formatCurrency(cartTotal)} goes straight to the farmer's account with zero middleman deductions.
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? 'Confirming Order...' : `Place Direct Order • ${formatCurrency(grandTotal)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
