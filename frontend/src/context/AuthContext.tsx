'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../lib/types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickSwitchUser: (selectedUser: User, customToken?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('kisanconnect_token');
    const savedUser = localStorage.getItem('kisanconnect_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('kisanconnect_token');
        localStorage.removeItem('kisanconnect_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await api.login(identifier, pass);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('kisanconnect_token', res.data.token);
        localStorage.setItem('kisanconnect_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('kisanconnect_token', res.data.token);
        localStorage.setItem('kisanconnect_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kisanconnect_token');
    localStorage.removeItem('kisanconnect_user');
  };

  const quickSwitchUser = async (selectedUser: User, customToken?: string) => {
    // If token not provided, login with default password 'password123'
    if (customToken) {
      setUser(selectedUser);
      setToken(customToken);
      localStorage.setItem('kisanconnect_token', customToken);
      localStorage.setItem('kisanconnect_user', JSON.stringify(selectedUser));
    } else {
      const res = await api.login(selectedUser.phone, 'password123');
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('kisanconnect_token', res.data.token);
        localStorage.setItem('kisanconnect_user', JSON.stringify(res.data.user));
      }
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('kisanconnect_user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitchUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
