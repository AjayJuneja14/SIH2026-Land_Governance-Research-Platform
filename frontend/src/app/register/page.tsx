'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { Sprout, ShoppingBag, UserPlus, AlertCircle } from 'lucide-react';
import { Role } from '../../lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t, language: currentAppLang, setLanguage: setAppLanguage } = useLanguage();

  const [role, setRole] = useState<Role>('FARMER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLang, setSelectedLang] = useState(currentAppLang);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register({
      name,
      phone,
      email: email || undefined,
      password,
      role,
      location,
      language: selectedLang,
    });

    setLoading(false);

    if (res.success) {
      if (role === 'FARMER') {
        router.push('/farmer');
      } else {
        router.push('/marketplace');
      }
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">{t('auth.registerTitle')}</h2>
          <p className="text-xs text-gray-500">
            Join thousands of Indian farmers and buyers trading directly
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">{t('auth.role')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    role === 'FARMER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">{t('auth.farmer')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    role === 'BUYER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">{t('auth.buyer')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {t('auth.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t('auth.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9820011111"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  placeholder="ramesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {t('auth.location')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">{t('auth.language')}</label>
                <select
                  value={selectedLang}
                  onChange={(e) => {
                    setSelectedLang(e.target.value as any);
                    setAppLanguage(e.target.value as any);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.label} ({l.labelEn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : t('auth.register')}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:underline">
              {t('auth.login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
