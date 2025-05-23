import { writable } from 'svelte/store';

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
    login: (user: User) => {
      update(state => ({
        ...state,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));
    },
    logout: () => {
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      }));
    },
    setError: (error: string) => {
      update(state => ({ ...state, error, isLoading: false }));
    },
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    clearError: () => {
      update(state => ({ ...state, error: null }));
    },
    checkAuth: async () => {
      // This would be replaced with actual API call
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Simulate API call
        const user = localStorage.getItem('user');
        
        if (user) {
          const userData = JSON.parse(user) as User;
          update(state => ({
            ...state,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
        } else {
          update(state => ({
            ...state,
            user: null,
            isAuthenticated: false,
            isLoading: false
          }));
        }
      } catch (error) {
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    }
  };
}

export const authStore = createAuthStore();