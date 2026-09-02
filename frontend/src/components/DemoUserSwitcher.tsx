'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Role } from '../lib/types';
import { api } from '../lib/api';
import { Users, Shield, Sprout, ShoppingBag, Check } from 'lucide-react';

export default function DemoUserSwitcher() {
  const { user, quickSwitchUser } = useAuth();
  const [demoAccounts, setDemoAccounts] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await api.getDemoAccounts();
        if (res.success && res.data) {
          setDemoAccounts(res.data);
        }
      } catch (e) {
        // Fallback default demo list if server is booting
        setDemoAccounts([
          { id: '1', name: 'Ramesh Kumar Patil', phone: '9820011111', role: 'FARMER', location: 'Nashik, Maharashtra', language: 'mr' },
          { id: '2', name: 'Priya Sharma', phone: '9810011111', role: 'BUYER', location: 'Pune, Maharashtra', language: 'en' },
          { id: '3', name: 'KisanConnect Admin', phone: '9999999999', role: 'ADMIN', location: 'New Delhi', language: 'en' },
        ]);
      }
    }
    loadAccounts();
  }, []);

  const handleSwitch = async (account: User) => {
    setSwitching(true);
    await quickSwitchUser(account);
    setSwitching(false);
    setIsOpen(false);
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'FARMER':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'BUYER':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-sm"
        title="Switch Demo Persona"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Demo: <strong className="font-bold">{user ? `${user.name.split(' ')[0]} (${user.role})` : 'Select Persona'}</strong></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Persona Switcher</p>
            <p className="text-[11px] text-gray-500">Test different user perspectives with 1-click</p>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 my-1">
            {demoAccounts.map((acc) => {
              const isActive = user?.phone === acc.phone;
              return (
                <button
                  key={acc.id}
                  onClick={() => handleSwitch(acc)}
                  disabled={switching}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                    isActive ? 'bg-emerald-50 font-semibold text-emerald-900' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="p-1.5 rounded-lg bg-gray-100 shrink-0">
                      {getRoleIcon(acc.role)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-900 truncate">{acc.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          acc.role === 'FARMER' ? 'bg-emerald-100 text-emerald-800' :
                          acc.role === 'BUYER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{acc.location}</p>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
