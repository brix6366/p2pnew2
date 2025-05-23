import { writable } from 'svelte/store';
import { api } from '../services/api';
import { API_ROUTES } from '../config/api';

export interface VehicleLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface VehicleReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  type: 'sedan' | 'suv' | 'truck' | 'van' | 'luxury' | 'convertible' | 'sports' | 'other';
  make: string;
  model: string;
  year: number;
  photos: string[];
  pricePerDay: number;
  location: VehicleLocation;
  features: string[];
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  availability: {
    startDate: Date;
    endDate: Date;
  }[];
  reviews: VehicleReview[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface VehicleState {
  vehicles: Vehicle[];
  featuredVehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  featuredVehicles: [],
  currentVehicle: null,
  isLoading: false,
  error: null
};

function createVehicleStore() {
  const { subscribe, set, update } = writable<VehicleState>(initialState);

  return {
    subscribe,
    
    fetchVehicles: async (filters = {}) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const queryString = new URLSearchParams(filters as Record<string, string>).toString();
        const endpoint = `${API_ROUTES.cars.list}${queryString ? `?${queryString}` : ''}`;
        const vehicles = await api.get<Vehicle[]>(endpoint);
        
        update(state => ({
          ...state,
          vehicles,
          featuredVehicles: vehicles.slice(0, 4),
          isLoading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch vehicles'
        }));
      }
    },

    getVehicleById: async (id: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const vehicle = await api.get<Vehicle>(API_ROUTES.cars.detail(id));
        update(state => ({
          ...state,
          currentVehicle: vehicle,
          isLoading: false,
          error: null
        }));
        return vehicle;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch vehicle'
        }));
        return null;
      }
    },

    createVehicle: async (vehicleData: Partial<Vehicle>) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const newVehicle = await api.post<Vehicle>(API_ROUTES.cars.create, vehicleData);
        update(state => ({
          ...state,
          vehicles: [...state.vehicles, newVehicle],
          isLoading: false,
          error: null
        }));
        return newVehicle;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to create vehicle'
        }));
        throw error;
      }
    },

    updateVehicle: async (id: string, vehicleData: Partial<Vehicle>) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const updatedVehicle = await api.put<Vehicle>(API_ROUTES.cars.update(id), vehicleData);
        update(state => ({
          ...state,
          vehicles: state.vehicles.map(v => v.id === id ? updatedVehicle : v),
          currentVehicle: state.currentVehicle?.id === id ? updatedVehicle : state.currentVehicle,
          isLoading: false,
          error: null
        }));
        return updatedVehicle;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to update vehicle'
        }));
        throw error;
      }
    },

    deleteVehicle: async (id: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        await api.delete(API_ROUTES.cars.delete(id));
        update(state => ({
          ...state,
          vehicles: state.vehicles.filter(v => v.id !== id),
          currentVehicle: state.currentVehicle?.id === id ? null : state.currentVehicle,
          isLoading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to delete vehicle'
        }));
        throw error;
      }
    },

    getVehiclesByOwner: async (ownerId: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const vehicles = await api.get<Vehicle[]>(API_ROUTES.cars.owner(ownerId));
        update(state => ({
          ...state,
          vehicles,
          isLoading: false,
          error: null
        }));
        return vehicles;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch owner vehicles'
        }));
        throw error;
      }
    },

    clearCurrentVehicle: () => {
      update(state => ({
        ...state,
        currentVehicle: null
      }));
    },

    clearError: () => {
      update(state => ({
        ...state,
        error: null
      }));
    }
  };
}

export const vehicleStore = createVehicleStore();