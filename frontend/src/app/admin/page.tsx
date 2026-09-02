'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { User, Produce, Order, Hub } from '../../lib/types';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../lib/utils';
import {
  Shield,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Sparkles,
  Bot,
  MapPin,
  TrendingUp,
  Cpu,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'produce' | 'orders' | 'hubs' | 'ai'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Sandbox state
  const [aiCrop, setAiCrop] = useState('Tomatoes');
  const [aiLocation, setAiLocation] = useState('Nashik');
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [routeResult, setRouteResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, produceRes, ordersRes, hubsRes] = await Promise.all([
        api.getAllUsers(),
        api.getAllProduce({ status: 'ALL' }),
        api.getAllOrders(),
        api.getAllHubs(),
      ]);

      if (usersRes.success) setUsers(usersRes.data || []);
      if (produceRes.success) setProduceList(produceRes.data || []);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (hubsRes.success) setHubs(hubsRes.data || []);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const runAiForecast = async () => {
    try {
      setAiLoading(true);
      const res = await api.getAiForecast(aiCrop, aiLocation);
      if (res.success) {
        setForecastResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const runAiRouteOptimize = async () => {
    try {
      setAiLoading(true);
      const res = await api.getAiRouteOptimization({
        pickupHubIds: hubs.map((h) => h.id),
        targetDestination: 'Pune Krishi Consumer Aggregation Center',
      });
      if (res.success) {
        setRouteResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteProduce = async (id: string) => {
    if (!confirm('Admin: Delete this produce listing?')) return;
    const res = await api.deleteProduce(id);
    if (res.success) loadAllData();
  };

  // Metrics
  const farmersCount = users.filter((u) => u.role === 'FARMER').length;
  const buyersCount = users.filter((u) => u.role === 'BUYER').length;
  const totalGMV = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-purple-400" />
            Platform Governance Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">KisanConnect Admin Panel</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Oversight of registered farmers, buyers, direct orders, local hubs, and AI algorithm sandbox.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {[
          { id: 'overview', label: 'Platform Overview', icon: TrendingUp },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'produce', label: `Produce (${produceList.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'hubs', label: `Hubs (${hubs.length})`, icon: Truck },
          { id: 'ai', label: 'AI Labs (Forecast & Routes)', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-semibold">Total Farmers</span>
              <div className="text-2xl font-black text-emerald-700">{farmersCount}</div>
              <span className="text-[11px] text-gray-400">Verified agricultural producers</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-semibold">Active Buyers</span>
              <div className="text-2xl font-black text-blue-700">{buyersCount}</div>
              <span className="text-[11px] text-gray-400">Consumers & institutional buyers</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-semibold">Total Orders</span>
              <div className="text-2xl font-black text-purple-700">{orders.length}</div>
              <span className="text-[11px] text-gray-400">Direct trade transactions</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-semibold">Gross Marketplace Value</span>
              <div className="text-2xl font-black text-emerald-800">{formatCurrency(totalGMV)}</div>
              <span className="text-[11px] text-emerald-700 font-bold">100% direct disintermediation</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">System Health & Logistics Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hubs.map((hub) => (
                <div key={hub.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    {hub.name}
                  </div>
                  <p className="text-gray-500">{hub.location}</p>
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-200">
                    <span>Coordinates: {hub.lat}, {hub.lng}</span>
                    <span className="font-bold text-emerald-700">{hub.contactNumber || 'Active'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Registered Platform Users</h3>
            <span className="text-xs text-gray-400">{users.length} accounts found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{u.name}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'FARMER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'BUYER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{u.phone}</td>
                    <td className="py-3.5 px-4 text-gray-500">{u.email || '—'}</td>
                    <td className="py-3.5 px-4">{u.location}</td>
                    <td className="py-3.5 px-4 text-gray-400">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Produce Moderation */}
      {activeTab === 'produce' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">All Produce Listings (Moderation)</h3>
            <span className="text-xs text-gray-400">{produceList.length} crops</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {produceList.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{p.name}</td>
                    <td className="py-3.5 px-4 font-medium">{p.category}</td>
                    <td className="py-3.5 px-4">{p.farmer?.name || 'Farmer'}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{p.quantity} {p.unit}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">{formatCurrency(p.pricePerUnit)}/{p.unit}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduce(p.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders Oversight */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Platform Orders Oversight</h3>
            <span className="text-xs text-gray-400">{orders.length} total orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">#{o.id.substring(0, 8)}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{o.produce.name}</td>
                    <td className="py-3.5 px-4">{o.buyer?.name || 'Buyer'}</td>
                    <td className="py-3.5 px-4">{o.produce.farmer?.name || 'Farmer'}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">{formatCurrency(o.totalPrice)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hubs */}
      {activeTab === 'hubs' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Local Aggregation Hubs</h3>
              <p className="text-xs text-gray-500">Physical drop-off and pickup centers with quality inspection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hubs.map((hub) => (
              <div key={hub.id} className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{hub.name}</h4>
                    <span className="text-[11px] text-emerald-800 font-semibold">Active Logistics Center</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{hub.location}</span>
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Geo-coordinates: <strong>{hub.lat}° N, {hub.lng}° E</strong>
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Helpline: <strong>{hub.contactNumber || '+91 98230 00000'}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: AI Labs Playground */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Innovation & Algorithm Testbench</span>
            </div>
            <h2 className="text-2xl font-black">Crop Demand Forecasting & Route Optimization</h2>
            <p className="text-xs text-purple-100 max-w-2xl">
              Testing bench for the scaffolded <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">/api/forecast</code> and <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">/api/route-optimize</code> mock endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 1: AI Price & Demand Forecasting */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AI Crop Demand & Mandi Price Forecast</h3>
                  <p className="text-[11px] text-gray-500">API: GET /api/forecast?crop=&location=</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={aiCrop}
                    onChange={(e) => setAiCrop(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Region / Mandi</label>
                  <input
                    type="text"
                    value={aiLocation}
                    onChange={(e) => setAiLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={runAiForecast}
                disabled={aiLoading}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {aiLoading ? 'Querying Forecast API...' : 'Run Forecast Analysis'}
              </button>

              {forecastResult && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>Demand Index: {forecastResult.currentMarketSentiment?.demandIndex}/100</span>
                    <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded text-[10px]">
                      {forecastResult.currentMarketSentiment?.trend}
                    </span>
                  </div>

                  <div className="space-y-1 text-gray-700 text-[11px]">
                    <div className="font-bold text-gray-900">4-Week Predicted Price Band:</div>
                    {forecastResult.weeklyPriceProjections?.map((w: any, idx: number) => (
                      <div key={idx} className="flex justify-between bg-white/80 p-1.5 rounded-lg">
                        <span>{w.week}:</span>
                        <span className="font-semibold text-purple-900">
                          Mandi ₹{w.predictedMandiPrice} ➔ Direct ₹{w.predictedDirectFairPrice} (Confidence: {w.confidence * 100}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-purple-900 bg-white/90 p-2.5 rounded-xl border border-purple-100">
                    <strong>Advisory:</strong> {forecastResult.weatherImpactAdvisory?.harvestingWindowRecommendation}
                  </div>
                </div>
              )}
            </div>

            {/* Tool 2: Route Optimization */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AI Logistics Route Optimizer</h3>
                  <p className="text-[11px] text-gray-500">API: POST /api/route-optimize</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <p>Simulate aggregation collection across all registered Kisan Hubs with optimal waypoint sequencing.</p>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] space-y-1">
                  <div><strong>Pickup Hubs:</strong> {hubs.map((h) => h.name).join(', ')}</div>
                  <div><strong>Destination:</strong> Pune Krishi Consumer Aggregation Center</div>
                </div>
              </div>

              <button
                onClick={runAiRouteOptimize}
                disabled={aiLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {aiLoading ? 'Calculating Optimal Route...' : 'Simulate Route Dispatch'}
              </button>

              {routeResult && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Total Distance</span>
                      <strong className="text-emerald-800 text-sm font-black">{routeResult.routeSummary?.totalDistanceKm} km</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Fuel Saved</span>
                      <strong className="text-emerald-800 text-sm font-black">{routeResult.routeSummary?.estimatedFuelSavedLiters} L</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-700">
                    <div className="font-bold text-gray-900">Waypoint Sequence:</div>
                    {routeResult.waypoints?.map((wp: any) => (
                      <div key={wp.step} className="flex items-center justify-between bg-white p-1.5 rounded-lg">
                        <span>Step {wp.step}: {wp.name}</span>
                        <span className="font-bold text-emerald-800">{wp.scheduledArrivalTime}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-emerald-900 bg-white/90 p-2 rounded-xl border border-emerald-100">
                    {routeResult.turnByTurnSummary}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
