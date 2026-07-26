import { apiRequest } from '../lib/apiClient';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  summary?: any;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, options);
}

export const api = {
  health: {
    check: () => request<{ status: string; message: string }>('/admin/health'),
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
    logout: () => {
      localStorage.removeItem('cozy_lagos_auth_token');
      return request('/auth/logout', { method: 'POST' });
    },
    me: () => request<any>('/auth/me'),
    updateProfile: (data: any) =>
      request<any>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request<any>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  users: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/users${qs}`);
    },
    getById: (id: string) => request<any>(`/users?id=${id}`),
    create: (data: any) =>
      request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/users', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/users', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  listings: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/listings${qs}`);
    },
    getById: (id: string) => request<any>(`/listings?id=${id}`),
    create: (data: any) =>
      request<any>('/listings', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/listings', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/listings', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  bookings: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/bookings${qs}`);
    },
    create: (data: any) =>
      request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<any>('/bookings', { method: 'PATCH', body: JSON.stringify({ id, status }) }),
    confirm: (id: string, notes?: string) =>
      request<any>('/bookings', { method: 'PATCH', body: JSON.stringify({ id, status: 'confirmed', notes }) }),
    cancel: (id: string, reason?: string) =>
      request<any>('/bookings', { method: 'PATCH', body: JSON.stringify({ id, status: 'cancelled', reason }) }),
    delete: (id: string) =>
      request<any>('/bookings', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  services: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/services${qs}`);
    },
    getByCategory: (category: string) => request<any[]>(`/services?category=${category}`),
    getById: (id: string) => request<any>(`/services?id=${id}`),
    create: (data: any) =>
      request<any>('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/services', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/services', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  experiences: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/experiences${qs}`);
    },
    create: (data: any) =>
      request<any>('/experiences', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/experiences', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/experiences', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  transactions: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/transactions${qs}`);
    },
    create: (data: any) =>
      request<any>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    processPayout: (id: string) =>
      request<any>('/transactions', { method: 'PATCH', body: JSON.stringify({ id, status: 'processed' }) }),
    delete: (id: string) =>
      request<any>('/transactions', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  staff: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/staff${qs}`);
    },
    create: (data: any) =>
      request<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/staff', { method: 'PUT', body: JSON.stringify(data) }),
    patch: (data: any) =>
      request<any>('/staff', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/staff', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  assets: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/admin/assets${qs}`);
    },
    create: (data: any) =>
      request<any>('/admin/assets', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/admin/assets', { method: 'PUT', body: JSON.stringify(data) }),
    patch: (data: any) =>
      request<any>('/admin/assets', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/admin/assets', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  admin: {
    getStats: () => request<any>('/admin/stats'),
    getAudit: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any>(`/admin/audit${qs}`);
    },
    processPayout: (bookingId: string, amount: number, method?: string) =>
      request<any>('/admin/process-payout', {
        method: 'POST',
        body: JSON.stringify({ bookingId, amount, method }),
      }),
  },

  cart: {
    sync: (cartData: any) =>
      request<any>('/cart/sync', { method: 'POST', body: JSON.stringify(cartData) }),
    get: () => request<any>('/cart'),
  },

  whatsapp: {
    sendBookingConfirmation: (data: any) =>
      request<any>('/whatsapp/booking-confirmation', { method: 'POST', body: JSON.stringify(data) }),
    sendAdminNotification: (data: any) =>
      request<any>('/whatsapp/admin-notification', { method: 'POST', body: JSON.stringify(data) }),
  },

  crm: {
    getTickets: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/crm/tickets${qs}`);
    },
    createTicket: (data: any) =>
      request<any>('/crm/tickets', { method: 'POST', body: JSON.stringify(data) }),
    updateTicket: (id: string, updates: any) =>
      request<any>('/crm/tickets', { method: 'PATCH', body: JSON.stringify({ id, ...updates }) }),
    deleteTicket: (id: string) =>
      request<any>('/crm/tickets', { method: 'DELETE', body: JSON.stringify({ id }) }),
    getNotifications: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/crm/notifications${qs}`);
    },
    sendNotification: (data: any) =>
      request<any>('/crm/notifications', { method: 'POST', body: JSON.stringify(data) }),
    updateNotification: (id: string, updates: any) =>
      request<any>('/crm/notifications', { method: 'PATCH', body: JSON.stringify({ id, ...updates }) }),
    deleteNotification: (id: string) =>
      request<any>('/crm/notifications', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },

  events: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/events${qs}`);
    },
    getTrending: () => request<any[]>('/events?isTrending=true&isActive=true'),
    create: (data: any) =>
      request<any>('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any) =>
      request<any>('/events', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>('/events', { method: 'DELETE', body: JSON.stringify({ id }) }),
    purchaseTickets: (eventId: string, ticketCount: number, userId: string, userName: string, userEmail: string) =>
      request<any>('/events', {
        method: 'PATCH',
        body: JSON.stringify({ eventId, ticketCount, userId, userName, userEmail }),
      }),
  },

  provider: {
    getStaff: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/provider/staff${qs}`);
    },
    createStaff: (data: any) =>
      request<any>('/provider/staff', { method: 'POST', body: JSON.stringify(data) }),
    updateStaff: (data: any) =>
      request<any>('/provider/staff', { method: 'PUT', body: JSON.stringify(data) }),
    deleteStaff: (id: string) =>
      request<any>('/provider/staff', { method: 'DELETE', body: JSON.stringify({ id }) }),
    getAssets: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/provider/assets${qs}`);
    },
    createAsset: (data: any) =>
      request<any>('/provider/assets', { method: 'POST', body: JSON.stringify(data) }),
    updateAsset: (data: any) =>
      request<any>('/provider/assets', { method: 'PUT', body: JSON.stringify(data) }),
    deleteAsset: (id: string) =>
      request<any>('/provider/assets', { method: 'DELETE', body: JSON.stringify({ id }) }),
    getServices: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/provider/services${qs}`);
    },
    createService: (data: any) =>
      request<any>('/provider/services', { method: 'POST', body: JSON.stringify(data) }),
    updateService: (data: any) =>
      request<any>('/provider/services', { method: 'PUT', body: JSON.stringify(data) }),
    deleteService: (id: string) =>
      request<any>('/provider/services', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },
};

export default api;
