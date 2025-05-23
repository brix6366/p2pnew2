const PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const API_URL = PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    verify: '/auth/verify',
  },
  cars: {
    list: '/cars',
    detail: (id: string) => `/cars/${id}`,
    create: '/cars',
    update: (id: string) => `/cars/${id}`,
    delete: (id: string) => `/cars/${id}`,
    owner: (userId: string) => `/cars/owner/${userId}`,
  },
  bookings: {
    create: '/bookings',
    list: '/bookings',
    detail: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
    asRenter: '/bookings/user',
    asOwner: '/bookings/owner',
  },
  payments: {
    createSession: '/payments/create-checkout-session',
  }
};