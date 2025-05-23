<script lang="ts">
  import { onMount } from 'svelte';
  import { vehicleStore, type Vehicle } from '../../lib/stores/vehicle';
  import VehicleCard from '../../lib/components/VehicleCard.svelte';
  import VehicleTypeSelector from '../../lib/components/VehicleTypeSelector.svelte';
  import DateRangePicker from '../../lib/components/DateRangePicker.svelte';
  
  let searchLocation = '';
  let startDate = '';
  let endDate = '';
  let selectedVehicleType: string | null = null;
  let minPrice = 0;
  let maxPrice = 300;
  let filteredVehicles: Vehicle[] = [];
  
  onMount(async () => {
    await vehicleStore.fetchVehicles();
    
    // Get query parameters
    const params = new URLSearchParams(window.location.search);
    searchLocation = params.get('location') || '';
    startDate = params.get('start') || '';
    endDate = params.get('end') || '';
    selectedVehicleType = params.get('type') || null;
    
    // Set default dates if not provided
    if (!startDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      startDate = tomorrow.toISOString().slice(0, 10);
    }
    
    if (!endDate) {
      const nextWeek = new Date(startDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      endDate = nextWeek.toISOString().slice(0, 10);
    }
    
    applyFilters();
  });
  
  // Watch for store changes
  $: if ($vehicleStore.vehicles) {
    applyFilters();
  }
  
  function applyFilters() {
    filteredVehicles = $vehicleStore.vehicles.filter(vehicle => {
      // Filter by location if provided
      if (searchLocation && !vehicle.location.city.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }
      
      // Filter by vehicle type if selected
      if (selectedVehicleType && vehicle.type !== selectedVehicleType) {
        return false;
      }
      
      // Filter by price range
      if (vehicle.pricePerDay < minPrice || vehicle.pricePerDay > maxPrice) {
        return false;
      }
      
      // TODO: Filter by availability based on start and end dates
      
      return true;
    });
  }
  
  function handleVehicleTypeSelect(event: CustomEvent) {
    selectedVehicleType = event.detail;
    applyFilters();
  }
  
  function handleDateChange() {
    // Could implement additional logic here if needed
    applyFilters();
  }
  
  function handlePriceChange() {
    applyFilters();
  }
</script>

<div class="min-h-screen bg-neutral-50 pt-20">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filters Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-card p-6">
          <h2 class="text-xl font-bold mb-6">Filters</h2>
          
          <!-- Location Filter -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Location</h3>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-3 h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <input 
                type="text" 
                placeholder="City, airport, or address" 
                bind:value={searchLocation}
                on:input={applyFilters}
                class="form-input pl-10"
              />
            </div>
          </div>
          
          <!-- Date Range Picker -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Dates</h3>
            <DateRangePicker bind:startDate bind:endDate on:change={handleDateChange} />
          </div>
          
          <!-- Vehicle Type Filter -->
          <VehicleTypeSelector 
            selectedType={selectedVehicleType} 
            on:select={handleVehicleTypeSelect}
          />
          
          <!-- Price Range Filter -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Price Range</h3>
              <span class="text-sm text-neutral-600">${minPrice} - ${maxPrice}+</span>
            </div>
            <div class="flex flex-col space-y-4">
              <input 
                type="range" 
                min="0" 
                max="300" 
                step="10" 
                bind:value={minPrice}
                on:input={handlePriceChange}
                class="w-full"
              />
              <input 
                type="range" 
                min="0" 
                max="300" 
                step="10" 
                bind:value={maxPrice}
                on:input={handlePriceChange}
                class="w-full"
              />
            </div>
          </div>
          
          <!-- More filters could be added here -->
          <div class="mt-6">
            <button type="button" class="btn btn-primary w-full">Apply Filters</button>
          </div>
        </div>
      </div>
      
      <!-- Results -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-card p-6 mb-6">
          <h1 class="text-2xl font-bold">
            {#if searchLocation}
              Cars in {searchLocation}
            {:else}
              Available Cars
            {/if}
          </h1>
          <p class="text-neutral-600">
            {filteredVehicles.length} cars available • {startDate} to {endDate}
          </p>
        </div>
        
        {#if $vehicleStore.isLoading}
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        {:else if filteredVehicles.length === 0}
          <div class="bg-white rounded-lg shadow-card p-8 text-center">
            <h3 class="text-xl font-semibold mb-2">No cars found</h3>
            <p class="text-neutral-600 mb-4">Try adjusting your search filters or try a different location.</p>
            <button type="button" class="btn btn-primary" on:click={() => {
              searchLocation = '';
              selectedVehicleType = null;
              minPrice = 0;
              maxPrice = 300;
              applyFilters();
            }}>Clear all filters</button>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each filteredVehicles as vehicle (vehicle.id)}
              <VehicleCard {vehicle} />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>