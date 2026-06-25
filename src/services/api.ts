const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('cozy_lagos_auth_token');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Request failed',
      };
    }

    return {
      success: data.success !== false,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  health: {
    check: () => request<{ status: string; message: string }>('/health'),
  },

  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: { email: string; name: string; password: string; role: string }) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () => request('/auth/logout', { method: 'POST' }),

    me: () => request<any>('/auth/me'),
  },

  users: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/users${query}`);
    },

    create: (data: { email: string; name: string; password: string; role: string; phone?: string }) =>
      request<any>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (data: { id: string; [key: string]: any }) =>
      request<any>('/users', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<any>('/users', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  listings: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/listings${query}`);
    },

    getById: (id: string) => request<any>(`/listings?id=${id}`),

    create: (data: any) =>
      request<any>('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (data: { id: string; [key: string]: any }) =>
      request<any>('/listings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<any>('/listings', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  bookings: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/bookings${query}`);
    },

    getById: (id: string) => request<any>(`/bookings?id=${id}`),

    create: (data: any) =>
      request<any>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateStatus: (id: string, status: string) =>
      request<any>('/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      }),

    confirm: (id: string) =>
      request<any>('/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'confirmed' }),
      }),

    cancel: (id: string) =>
      request<any>('/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'cancelled' }),
      }),
  },

  services: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/services${query}`);
    },

    getByCategory: (category: string) =>
      request<any[]>(`/services?category=${category}`),

    getById: (id: string) => request<any>(`/services?id=${id}`),

    create: (data: any) =>
      request<any>('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request<any>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request(`/services/${id}`, { method: 'DELETE' }),
  },

  experiences: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/experiences${query}`);
    },

    getById: (id: string) => request<any>(`/experiences/${id}`),

    book: (data: any) =>
      request<any>('/experiences/book', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  transactions: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/transactions${query}`);
    },

    create: (data: any) =>
      request<any>('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    processPayout: (id: string) =>
      request<any>('/transactions', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'processed' }),
      }),
  },

  cart: {
    sync: (cartData: any) =>
      request<any>('/cart/sync', {
        method: 'POST',
        body: JSON.stringify(cartData),
      }),

    get: () => request<any>('/cart'),
  },

  admin: {
    getPendingBookings: () => request<any[]>('/bookings?status=pending'),

    confirmBooking: (id: string, notes?: string) =>
      request<any>(`/bookings`, {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'confirmed', notes }),
      }),

    rejectBooking: (id: string, reason: string) =>
      request<any>(`/bookings`, {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'cancelled', reason }),
      }),

    getStats: () => request<any>('/admin/stats'),

    getUsers: () => request<any[]>('/users'),

    getTransactions: () => request<any[]>('/transactions'),
  },

  assets: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/assets${query}`);
    },

    create: (data: any) =>
      request<any>('/assets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (data: { id: string; [key: string]: any }) =>
      request<any>('/assets', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    patch: (data: { id: string; [key: string]: any }) =>
      request<any>('/assets', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<any>('/assets', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  staff: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/staff${query}`);
    },

    create: (data: any) =>
      request<any>('/staff', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (data: { id: string; [key: string]: any }) =>
      request<any>('/staff', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    patch: (data: { id: string; [key: string]: any }) =>
      request<any>('/staff', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<any>('/staff', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  whatsapp: {
    sendBookingConfirmation: (bookingData: any) =>
      request<any>('/whatsapp/booking-confirmation', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),

    sendAdminNotification: (message: string) =>
      request<any>('/whatsapp/admin-notification', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  },
};

export default api;
