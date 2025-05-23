import { writable } from 'svelte/store';
import { api } from '../services/api';
import { API_ROUTES } from '../config/api';

export interface Booking {
  id: string;
  car: string;
  renter: string;
  owner: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending_payment' | 'confirmed' | 'active' | 'completed' | 'cancelled_by_renter' | 'cancelled_by_owner' | 'payment_failed';
  paymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null
};

function createBookingStore() {
  const { subscribe, set, update } = writable<BookingState>(initialState);

  return {
    subscribe,

    createBooking: async (bookingData: { carId: string; startDate: Date; endDate: Date }) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const booking = await api.post<Booking>(API_ROUTES.bookings.create, bookingData);
        update(state => ({
          ...state,
          currentBooking: booking,
          bookings: [...state.bookings, booking],
          isLoading: false,
          error: null
        }));
        return booking;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to create booking'
        }));
        throw error;
      }
    },

    getUserBookingsAsRenter: async () => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const bookings = await api.get<Booking[]>(API_ROUTES.bookings.asRenter);
        update(state => ({
          ...state,
          bookings,
          isLoading: false,
          error: null
        }));
        return bookings;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch bookings'
        }));
        throw error;
      }
    },

    getUserBookingsAsOwner: async () => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const bookings = await api.get<Booking[]>(API_ROUTES.bookings.asOwner);
        update(state => ({
          ...state,
          bookings,
          isLoading: false,
          error: null
        }));
        return bookings;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch bookings'
        }));
        throw error;
      }
    },

    cancelBooking: async (bookingId: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const booking = await api.put<Booking>(API_ROUTES.bookings.cancel(bookingId), {});
        update(state => ({
          ...state,
          bookings: state.bookings.map(b => b.id === bookingId ? booking : b),
          currentBooking: state.currentBooking?.id === bookingId ? booking : state.currentBooking,
          isLoading: false,
          error: null
        }));
        return booking;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to cancel booking'
        }));
        throw error;
      }
    },

    createCheckoutSession: async (bookingId: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const response = await api.post<{ sessionId: string; sessionUrl: string }>(
          API_ROUTES.payments.createSession,
          { bookingId }
        );
        update(state => ({ ...state, isLoading: false, error: null }));
        return response;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to create checkout session'
        }));
        throw error;
      }
    },

    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const bookingStore = createBookingStore();