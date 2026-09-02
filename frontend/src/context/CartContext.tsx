'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Produce, CartItem } from '../lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (produce: Produce, quantity?: number) => void;
  updateQuantity: (produceId: string, quantity: number) => void;
  removeFromCart: (produceId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kisanconnect_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('kisanconnect_cart');
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('kisanconnect_cart', JSON.stringify(newItems));
  };

  const addToCart = (produce: Produce, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.produce.id === produce.id);
    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + quantity;
      // Cap at available stock
      updated[existingIndex].quantity = Math.min(newQty, produce.quantity);
      saveCart(updated);
    } else {
      saveCart([...items, { produce, quantity: Math.min(quantity, produce.quantity) }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (produceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(produceId);
      return;
    }
    const updated = items.map((item) => {
      if (item.produce.id === produceId) {
        return { ...item, quantity: Math.min(quantity, item.produce.quantity) };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeFromCart = (produceId: string) => {
    const updated = items.filter((item) => item.produce.id !== produceId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.produce.pricePerUnit * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
