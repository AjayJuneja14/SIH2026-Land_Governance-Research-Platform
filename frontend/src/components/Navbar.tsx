'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import DemoUserSwitcher from './DemoUserSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Sprout,
  ShoppingBag,
  ShoppingCart,
  Shield,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LogIn,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navLinks = [
    { label: t('nav.marketplace'), href: '/marketplace', icon: ShoppingBag },
    ...(user?.role === 'FARMER' || user?.role === 'ADMIN'
      ? [{ label: t('nav.farmerDashboard'), href: '/farmer', icon: Sprout }]
      : []),
    ...(user?.role === 'BUYER' || !user
      ? [{ label: t('nav.myOrders'), href: '/orders', icon: Layers }]
      : []),
    ...(user?.role === 'ADMIN'
      ? [{ label: t('nav.adminPanel'), href: '/admin', icon: Shield }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
              {t('nav.directTrade')}
            </span>
            <span className="hidden sm:inline">{t('nav.tagline')}</span>
            <span className="sm:hidden">{t('nav.taglineMobile')}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Switcher in top bar (mobile-friendly) */}
            <LanguageSwitcher />
            <DemoUserSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center gap-1">
                Kisan<span className="text-emerald-600">Connect</span>
              </span>
              <span className="block text-[10px] text-gray-400 -mt-1 font-semibold tracking-wider uppercase">
                {t('nav.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 transition"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white text-xs font-semibold text-gray-800 transition shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.phone}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'FARMER' && (
                        <Link
                          href="/farmer"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl"
                        >
                          <Sprout className="w-4 h-4 text-emerald-600" />
                          {t('nav.farmerDashboard')}
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl"
                      >
                        <Layers className="w-4 h-4 text-emerald-600" />
                        {t('nav.myOrders')}
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-800 rounded-xl"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          {t('nav.adminConsole')}
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdown(false);
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-emerald-700 rounded-xl transition"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                >
                  {t('nav.joinKisanConnect')}
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          {!user && (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4" />
                {t('nav.signIn')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
