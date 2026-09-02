const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('kisanconnect_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(identifier: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // Produce
  async getAllProduce(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/produce${query ? `?${query}` : ''}`, {
      cache: 'no-store',
    });
    return res.json();
  },

  async getProduceById(id: string) {
    const res = await fetch(`${API_BASE}/produce/${id}`, {
      cache: 'no-store',
    });
    return res.json();
  },

  async createProduce(data: any) {
    const res = await fetch(`${API_BASE}/produce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateProduce(id: string, data: any) {
    const res = await fetch(`${API_BASE}/produce/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteProduce(id: string) {
    const res = await fetch(`${API_BASE}/produce/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Orders
  async createOrder(data: any) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return res.json();
  },

  async getFarmerOrders() {
    const res = await fetch(`${API_BASE}/orders/farmer-orders`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return res.json();
  },

  async getAllOrders(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders/all${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Hubs
  async getAllHubs() {
    const res = await fetch(`${API_BASE}/hubs`, {
      cache: 'no-store',
    });
    return res.json();
  },

  // Users (Admin)
  async getAllUsers(role?: string) {
    const query = role ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/users${query}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return res.json();
  },

  // AI Mock Endpoints
  async getAiForecast(crop: string, location: string) {
    const res = await fetch(`${API_BASE}/forecast?crop=${encodeURIComponent(crop)}&location=${encodeURIComponent(location)}`, {
      cache: 'no-store',
    });
    return res.json();
  },

  async getAiRouteOptimization(data: any) {
    const res = await fetch(`${API_BASE}/route-optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return res.json();
  },
};
