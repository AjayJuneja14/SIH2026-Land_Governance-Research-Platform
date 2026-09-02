'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, LogIn, Sparkles, Shield, ShoppingBag, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickSwitchUser } = useAuth();
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      router.push('/marketplace');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (role: 'FARMER' | 'BUYER' | 'ADMIN') => {
    setLoading(true);
    if (role === 'FARMER') {
      await quickSwitchUser({
        id: 'farmer-1',
        name: 'Ramesh Kumar Patil',
        phone: '9820011111',
        role: 'FARMER',
        location: 'Nashik, Maharashtra',
        language: 'mr',
      });
      router.push('/farmer');
    } else if (role === 'BUYER') {
      await quickSwitchUser({
        id: 'buyer-1',
        name: 'Priya Sharma',
        phone: '9810011111',
        role: 'BUYER',
        location: 'Pune, Maharashtra',
        language: 'en',
      });
      router.push('/marketplace');
    } else {
      await quickSwitchUser({
        id: 'admin-1',
        name: 'KisanConnect Admin',
        phone: '9999999999',
        role: 'ADMIN',
        location: 'New Delhi',
        language: 'en',
      });
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">{t('auth.loginTitle')}</h2>
          <p className="text-xs text-gray-500">
            Access your direct farmer dashboard or buyer marketplace
          </p>
        </div>

        {/* 1-Click Demo Accounts Box */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              1-Click Demo Testing
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase">
              Instant
            </span>
          </div>
          <p className="text-[11px] text-gray-600">
            Click any button below to instantly sign in with seed data:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleDemoLogin('FARMER')}
              disabled={loading}
              className="p-2 bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-center transition flex flex-col items-center gap-1"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold text-gray-800">Farmer Demo</span>
            </button>

            <button
              onClick={() => handleDemoLogin('BUYER')}
              disabled={loading}
              className="p-2 bg-white hover:bg-blue-50 rounded-xl border border-blue-200 text-center transition flex flex-col items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold text-gray-800">Buyer Demo</span>
            </button>

            <button
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={loading}
              className="p-2 bg-white hover:bg-purple-50 rounded-xl border border-purple-200 text-center transition flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-[10px] font-bold text-gray-800">Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Traditional Login Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {t('auth.phone')} / {t('auth.email')}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9820011111"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : t('auth.login')}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
            {t('auth.dontHaveAccount')}{' '}
            <Link href="/register" className="font-bold text-emerald-700 hover:underline">
              {t('auth.register')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
