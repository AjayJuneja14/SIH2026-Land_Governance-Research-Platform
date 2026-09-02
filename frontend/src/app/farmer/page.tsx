'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Produce, Order } from '../../lib/types';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../lib/utils';
import AddProduceModal from '../../components/AddProduceModal';
import EditProduceModal from '../../components/EditProduceModal';
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Edit,
  Trash2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [farmerProduce, setFarmerProduce] = useState<Produce[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduce, setEditingProduce] = useState<Produce | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings');

  useEffect(() => {
    if (user && user.role !== 'FARMER' && user.role !== 'ADMIN') {
      // If buyer, prompt or allow viewing with demo switch
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      // If logged in as farmer, fetch farmer-specific produce and orders
      if (user?.id) {
        const produceRes = await api.getAllProduce({ farmerId: user.id });
        if (produceRes.success && produceRes.data) {
          setFarmerProduce(produceRes.data);
        }

        const ordersRes = await api.getFarmerOrders();
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        }
      } else {
        // Fallback demo farmer produce
        const produceRes = await api.getAllProduce();
        if (produceRes.success && produceRes.data) {
          setFarmerProduce(produceRes.data.slice(0, 4));
        }
      }
    } catch (e) {
      console.error('Error loading farmer dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        loadData();
      } else {
        alert('Failed to update status: ' + (res.message || 'Unknown'));
      }
    } catch (e: any) {
      alert('Error updating order: ' + e.message);
    }
  };

  const handleDeleteProduce = async (produceId: string) => {
    if (!confirm('Are you sure you want to delete this produce listing?')) return;
    try {
      const res = await api.deleteProduce(produceId);
      if (res.success) {
        loadData();
      } else {
        alert('Failed to delete produce: ' + (res.message || 'Error'));
      }
    } catch (e: any) {
      alert('Error deleting produce: ' + e.message);
    }
  };

  // Metrics
  const activeListingsCount = farmerProduce.filter((p) => p.status === 'AVAILABLE').length;
  const totalStockKg = farmerProduce.reduce((acc, p) => acc + (p.unit === 'kg' ? p.quantity : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
  const totalEarnings = orders
    .filter((o) => o.status === 'DELIVERED' || o.status === 'CONFIRMED' || o.status === 'PICKED_UP')
    .reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            Farmer Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user ? user.name : 'Farmer'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {user?.location || 'Nashik, Maharashtra'} • Manage your harvest stock, track direct incoming orders, and set your own prices.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> List New Harvest Crop
        </button>
      </div>

      {/* Role Notice if not logged in as farmer */}
      {user && user.role !== 'FARMER' && user.role !== 'ADMIN' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are currently logged in as <strong>{user.name} (Role: {user.role})</strong>. Use the <strong>Demo Switcher</strong> at the top right to switch to a Farmer account (e.g. Ramesh Kumar).
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Active Listings</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{activeListingsCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Live on Marketplace</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Stock in Hubs</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalStockKg.toLocaleString()} kg</div>
          <div className="text-[11px] text-gray-500 font-medium">Ready for dispatch</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Orders in Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingOrdersCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Requires dispatch attention</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Direct Farmer Payouts</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(totalEarnings)}</div>
          <div className="text-[11px] text-emerald-800 font-bold">100% Net Realization</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          My Crop Listings ({farmerProduce.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          Incoming Buyer Orders ({orders.length})
        </button>
      </div>

      {/* Tab 1: Produce Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Crop Inventory Management</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Listing
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Produce</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Available Stock</th>
                  <th className="py-3.5 px-4">Your Price</th>
                  <th className="py-3.5 px-4">Grade</th>
                  <th className="py-3.5 px-4">Harvest Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farmerProduce.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      No produce listings yet. Click "List New Harvest Crop" to add your first harvest!
                    </td>
                  </tr>
                ) : (
                  farmerProduce.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block truncate max-w-[180px]">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.hub?.name || 'Local Farm'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">
                        {formatCurrency(p.pricePerUnit)}/{p.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.qualityGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{formatDate(p.harvestDate)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingProduce(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduce(p.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Incoming Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Direct Buyer Orders</h3>
            <p className="text-xs text-gray-500">Dispatch crops to pickup hub or directly to buyer</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Crop</th>
                  <th className="py-3.5 px-4">Buyer & Location</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Total Farmer Payout</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No incoming orders yet. Orders will appear here as soon as buyers checkout!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                        #{o.id.substring(0, 8)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{o.produce.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-800 block">{o.buyer?.name || 'Verified Buyer'}</span>
                        <span className="text-[10px] text-gray-400 block truncate max-w-[160px]">
                          {o.deliveryAddress}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {o.quantity} {o.produce.unit}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">
                        {formatCurrency(o.totalPrice)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-xl shadow-sm"
                          >
                            Accept Order
                          </button>
                        )}
                        {o.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'PICKED_UP')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-xl shadow-sm"
                          >
                            Mark Picked Up at Hub
                          </button>
                        )}
                        {o.status === 'PICKED_UP' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'DELIVERED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {o.status === 'DELIVERED' && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddProduceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />

      <EditProduceModal
        produce={editingProduce}
        isOpen={!!editingProduce}
        onClose={() => setEditingProduce(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
