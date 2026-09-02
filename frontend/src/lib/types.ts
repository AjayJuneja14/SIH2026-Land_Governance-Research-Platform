export type Role = 'FARMER' | 'BUYER' | 'ADMIN';

export type ProduceStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'CASH_ON_DELIVERY';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: Role;
  location: string;
  language: string;
  createdAt?: string;
  _count?: {
    produce: number;
    orders: number;
  };
}

export interface Hub {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  contactNumber?: string | null;
  _count?: {
    produce: number;
    orders: number;
  };
}

export interface Produce {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  qualityGrade: string;
  harvestDate: string;
  imageUrl?: string | null;
  status: ProduceStatus;
  hubId?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
  farmer?: {
    id: string;
    name: string;
    phone: string;
    location: string;
    language?: string;
  };
  hub?: Hub | null;
}

export interface Order {
  id: string;
  buyerId: string;
  produceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: string;
  hubId?: string | null;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  produce: Produce;
  buyer?: {
    id: string;
    name: string;
    phone: string;
    location: string;
  };
  hub?: Hub | null;
}

export interface CartItem {
  produce: Produce;
  quantity: number;
}
