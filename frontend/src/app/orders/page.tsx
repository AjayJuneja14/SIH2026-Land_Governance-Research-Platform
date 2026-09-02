'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Order, OrderStatus } from '../../lib/types';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../lib/utils';
import {
  Layers,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  Package,
  XCircle,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.updateOrderStatus(orderId, 'CANCELLED');
      if (res.success) {
        loadOrders();
      } else {
        alert('Failed to cancel order: ' + res.message);
      }
    } catch (e: any) {
      alert('Error cancelling order: ' + e.message);
    }
  };

  const getTimelineStep = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'PICKED_UP':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-emerald-300" />
            Direct Order Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">My Farm Purchases</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
            Real-time status of your direct farmer harvest orders from pickup hub to your doorstep.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow transition flex items-center gap-2 shrink-0"
        >
          Browse Marketplace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not placed any direct farmer harvest orders yet. Browse our marketplace to support local farmers!
          </p>
          <Link
            href="/marketplace"
            className="mt-2 inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getTimelineStep(order.status);
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6 hover:border-emerald-300 transition duration-200"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-500 font-bold">
                        Order #{order.id.substring(0, 8)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Placed {formatDate(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {order.deliveryAddress}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-gray-400 font-medium">Total Amount</div>
                    <div className="text-lg font-black text-emerald-700">
                      {formatCurrency(order.totalPrice)}
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline Bar */}
                {!isCancelled ? (
                  <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          1
                        </div>
                        <span className={`text-[11px] block font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                          Placed
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          2
                        </div>
                        <span className={`text-[11px] block font-bold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                          Confirmed
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          3
                        </div>
                        <span className={`text-[11px] block font-bold ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                          Hub Picked
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                            step >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          4
                        </div>
                        <span className={`text-[11px] block font-bold ${step >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200 font-medium">
                    <XCircle className="w-4 h-4 shrink-0" />
                    This order was cancelled.
                  </div>
                )}

                {/* Produce Item Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.produce.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                      alt={order.produce.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{order.produce.name}</h4>
                      <p className="text-xs text-gray-500">
                        Farmer: <strong>{order.produce.farmer?.name || 'Local Farmer'}</strong> ({order.produce.farmer?.location})
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        Quantity: {order.quantity} {order.produce.unit} • {formatCurrency(order.unitPrice)}/{order.produce.unit}
                      </p>
                    </div>
                  </div>

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl border border-red-200 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
