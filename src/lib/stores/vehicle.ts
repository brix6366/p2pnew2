import { writable } from 'svelte/store';

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
    fetchVehicles: async () => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // This would be an API call in a real implementation
        // Mock data for now
        const mockVehicles = getMockVehicles();
        
        update(state => ({
          ...state,
          vehicles: mockVehicles,
          featuredVehicles: mockVehicles.slice(0, 4),
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
        // Mock finding a vehicle by ID
        const mockVehicles = getMockVehicles();
        const vehicle = mockVehicles.find(v => v.id === id) || null;
        
        update(state => ({
          ...state,
          currentVehicle: vehicle,
          isLoading: false,
          error: vehicle ? null : 'Vehicle not found'
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
    clearCurrentVehicle: () => {
      update(state => ({
        ...state,
        currentVehicle: null
      }));
    }
  };
}

// Mock data function
function getMockVehicles(): Vehicle[] {
  return [
    {
      id: '1',
      ownerId: 'owner1',
      ownerName: 'John Doe',
      title: 'Luxury Tesla Model S',
      description: 'Experience the future of driving with this premium electric sedan. Perfect for business trips or weekend getaways.',
      type: 'luxury',
      make: 'Tesla',
      model: 'Model S',
      year: 2022,
      photos: [
        'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/12309080/pexels-photo-12309080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      pricePerDay: 150,
      location: {
        address: '123 Electric Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        latitude: 37.7749,
        longitude: -122.4194
      },
      features: ['Autopilot', 'Supercharging', 'Premium Sound', 'Heated Seats'],
      seats: 5,
      transmission: 'automatic',
      fuelType: 'electric',
      availability: [
        {
          startDate: new Date(2023, 6, 1),
          endDate: new Date(2023, 8, 30)
        }
      ],
      reviews: [
        {
          id: 'r1',
          userId: 'user1',
          userName: 'Alice Johnson',
          userAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
          rating: 5,
          comment: 'Amazing car! Super clean and drove perfectly.',
          date: new Date(2023, 5, 15)
        },
        {
          id: 'r2',
          userId: 'user2',
          userName: 'Bob Smith',
          rating: 4,
          comment: 'Great experience overall. Pickup was a bit delayed.',
          date: new Date(2023, 5, 20)
        }
      ],
      averageRating: 4.5,
      createdAt: new Date(2023, 1, 1),
      updatedAt: new Date(2023, 5, 1)
    },
    {
      id: '2',
      ownerId: 'owner2',
      ownerName: 'Jane Smith',
      title: 'Reliable Toyota RAV4 SUV',
      description: 'Spacious and fuel-efficient SUV, perfect for family trips or outdoor adventures.',
      type: 'suv',
      make: 'Toyota',
      model: 'RAV4',
      year: 2021,
      photos: [
        'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/7604425/pexels-photo-7604425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      pricePerDay: 75,
      location: {
        address: '456 Highland Dr',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        latitude: 47.6062,
        longitude: -122.3321
      },
      features: ['Bluetooth', 'Backup Camera', 'Roof Rack', 'AWD'],
      seats: 5,
      transmission: 'automatic',
      fuelType: 'gasoline',
      availability: [
        {
          startDate: new Date(2023, 6, 15),
          endDate: new Date(2023, 7, 15)
        }
      ],
      reviews: [
        {
          id: 'r3',
          userId: 'user3',
          userName: 'Carlos Rivera',
          userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          rating: 5,
          comment: 'Perfect for our camping trip! Very clean and great on gas.',
          date: new Date(2023, 4, 10)
        }
      ],
      averageRating: 5,
      createdAt: new Date(2023, 2, 15),
      updatedAt: new Date(2023, 4, 12)
    },
    {
      id: '3',
      ownerId: 'owner3',
      ownerName: 'Michael Johnson',
      title: 'Sporty Mazda MX-5 Convertible',
      description: 'Fun and sporty convertible, perfect for sunny days and coastal drives.',
      type: 'convertible',
      make: 'Mazda',
      model: 'MX-5 Miata',
      year: 2020,
      photos: [
        'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      pricePerDay: 90,
      location: {
        address: '789 Ocean Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        latitude: 34.0522,
        longitude: -118.2437
      },
      features: ['Convertible Top', 'Premium Sound', 'Leather Seats'],
      seats: 2,
      transmission: 'manual',
      fuelType: 'gasoline',
      availability: [
        {
          startDate: new Date(2023, 7, 1),
          endDate: new Date(2023, 8, 30)
        }
      ],
      reviews: [
        {
          id: 'r4',
          userId: 'user4',
          userName: 'Diana Lee',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          rating: 4,
          comment: 'So much fun to drive along the coast! Owner was very flexible with pickup.',
          date: new Date(2023, 3, 22)
        },
        {
          id: 'r5',
          userId: 'user5',
          userName: 'Ethan Wright',
          rating: 5,
          comment: 'Amazing ride! Would rent again in a heartbeat.',
          date: new Date(2023, 4, 5)
        }
      ],
      averageRating: 4.5,
      createdAt: new Date(2023, 1, 10),
      updatedAt: new Date(2023, 3, 20)
    },
    {
      id: '4',
      ownerId: 'owner4',
      ownerName: 'Sarah Wilson',
      title: 'Spacious Honda Odyssey Minivan',
      description: 'The perfect family vehicle with plenty of space for passengers and luggage.',
      type: 'van',
      make: 'Honda',
      model: 'Odyssey',
      year: 2021,
      photos: [
        'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/175799/pexels-photo-175799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      pricePerDay: 95,
      location: {
        address: '101 Family Lane',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60007',
        latitude: 41.8781,
        longitude: -87.6298
      },
      features: ['DVD Player', 'Bluetooth', 'Backup Camera', 'Sliding Doors'],
      seats: 8,
      transmission: 'automatic',
      fuelType: 'gasoline',
      availability: [
        {
          startDate: new Date(2023, 6, 1),
          endDate: new Date(2023, 7, 15)
        }
      ],
      reviews: [
        {
          id: 'r6',
          userId: 'user6',
          userName: 'Frank Miller',
          userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          rating: 5,
          comment: 'Perfect for our family vacation! Plenty of space and drove very smoothly.',
          date: new Date(2023, 5, 2)
        }
      ],
      averageRating: 5,
      createdAt: new Date(2023, 3, 5),
      updatedAt: new Date(2023, 5, 1)
    }
  ];
}

export const vehicleStore = createVehicleStore();