<script lang="ts">
  import { onMount } from 'svelte';
  import VehicleCard from './VehicleCard.svelte';
  import { vehicleStore } from '../stores/vehicle';
  
  onMount(async () => {
    await vehicleStore.fetchVehicles();
  });
</script>

<section class="py-16 bg-neutral-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">Featured Vehicles</h2>
      <p class="text-neutral-600 max-w-2xl mx-auto">Discover our selection of top-rated vehicles available for rent in your area. From luxury sports cars to family SUVs.</p>
    </div>
    
    {#if $vehicleStore.isLoading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    {:else if $vehicleStore.featuredVehicles.length === 0}
      <div class="text-center py-12">
        <p class="text-neutral-600">No vehicles available at the moment. Check back soon!</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each $vehicleStore.featuredVehicles as vehicle (vehicle.id)}
          <VehicleCard {vehicle} />
        {/each}
      </div>
      
      <div class="text-center mt-12">
        <a href="/search" class="btn btn-primary">View All Vehicles</a>
      </div>
    {/if}
  </div>
</section>