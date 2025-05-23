import { writable } from 'svelte/store';
import { api } from '../services/api';
import { API_ROUTES } from '../config/api';

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  isOwner: boolean;
  createdAt: Date;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Create the store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    register: async (credentials: { name: string; email: string; password: string }) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await api.post<AuthResponse>(API_ROUTES.auth.register, credentials);
        localStorage.setItem('token', response.token);
        update(state => ({
          ...state,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        update(state => ({ ...state, error: message, isLoading: false }));
        throw error;
      }
    },

    login: async (credentials: { email: string; password: string }) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      try {
        const response = await api.post<AuthResponse>(API_ROUTES.auth.login, credentials);
        localStorage.setItem('token', response.token);
        update(state => ({
          ...state,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        update(state => ({ ...state, error: message, isLoading: false }));
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      }));
    },

    checkAuth: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          isLoading: false
        }));
        return;
      }

      update(state => ({ ...state, isLoading: true }));
      try {
        const response = await api.get<User>(API_ROUTES.auth.verify);
        update(state => ({
          ...state,
          user: response,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
      } catch (error) {
        localStorage.removeItem('token');
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        }));
      }
    },

    setError: (error: string) => {
      update(state => ({ ...state, error, isLoading: false }));
    },

    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const authStore = createAuthStore();