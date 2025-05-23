<script lang="ts">
  import { Link } from 'svelte-routing';
  import type { Vehicle } from '../stores/vehicle';
  
  export let vehicle: Vehicle;
  
  // Format price to currency
  const formatCurrency = (amount: number) => {
    // Consider using a frontend environment variable for currency in the future
    // e.g., import.meta.env.VITE_CURRENCY_CODE || 'PHP'
    return new Intl.NumberFormat('en-PH', { // Using 'en-PH' locale for Philippine context
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0 // Adjust if fractional pesos are common/needed
    }).format(amount);
  };
</script>

<div class="card animate-enter hover:scale-[1.02] transition-transform duration-300">
  <Link to={`/vehicles/${vehicle.id}`}>
    <div class="relative h-48 overflow-hidden">
      <img 
        src={vehicle.photos[0]} 
        alt={`${vehicle.make} ${vehicle.model}`}
        class="w-full h-full object-cover"
      />
      <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <span class="text-xl font-bold">{vehicle.make} {vehicle.model}</span>
      </div>
      <div class="absolute top-4 right-4">
        <span class="badge badge-primary">{vehicle.type}</span>
      </div>
    </div>
  </Link>
  <div class="p-4">
    <div class="flex items-center justify-between mb-2">
      <p class="text-lg font-bold text-neutral-900">{formatCurrency(vehicle.pricePerDay)}<span class="text-sm font-normal text-neutral-600">/day</span></p>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="ml-1 text-neutral-800">{vehicle.averageRating.toFixed(1)}</span>
      </div>
    </div>
    <p class="text-neutral-600">{vehicle.year} · {vehicle.seats} seats · {vehicle.transmission}</p>
    <div class="mt-2">
      <div class="flex items-center text-neutral-700 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{vehicle.location.city}, {vehicle.location.state}</span>
      </div>
    </div>
    <div class="mt-4">
      <Link to={`/vehicles/${vehicle.id}`} class="btn btn-outline w-full text-center">View Details</Link>
    </div>
  </div>
</div>
