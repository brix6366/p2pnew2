<script lang="ts">
  import { onMount } from 'svelte';
  import { vehicleStore } from '../lib/stores/vehicle';
  import { authStore } from '../lib/stores/auth';
  import DateRangePicker from '../lib/components/DateRangePicker.svelte';
  
  export let id: string;
  
  let startDate = '';
  let endDate = '';
  let totalDays = 0;
  let totalPrice = 0;
  let currentImageIndex = 0;
  let isModalOpen = false;
  let selectedTab = 'details';
  
  onMount(async () => {
    await vehicleStore.getVehicleById(id);
    
    // Set default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDate = tomorrow.toISOString().slice(0, 10);
    
    const nextWeek = new Date(startDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    endDate = nextWeek.toISOString().slice(0, 10);
    
    calculateTotalPrice();
  });
  
  function calculateTotalPrice() {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if ($vehicleStore.currentVehicle) {
      totalPrice = totalDays * $vehicleStore.currentVehicle.pricePerDay;
    }
  }
  
  function handleDateChange() {
    calculateTotalPrice();
  }
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  function navigateImage(direction: number) {
    if (!$vehicleStore.currentVehicle) return;
    
    const totalImages = $vehicleStore.currentVehicle.photos.length;
    if (direction > 0) {
      currentImageIndex = (currentImageIndex + 1) % totalImages;
    } else {
      currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    }
  }
  
  function openModal() {
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = 'auto';
  }
</script>

<div class="min-h-screen bg-neutral-50 pt-20 pb-16">
  {#if $vehicleStore.isLoading}
    <div class="container mx-auto px-4 py-16 flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  {:else if !$vehicleStore.currentVehicle}
    <div class="container mx-auto px-4 py-16 text-center">
      <h2 class="text-2xl font-bold mb-4">Vehicle not found</h2>
      <p class="text-neutral-600 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
      <a href="/search" class="btn btn-primary">Browse Available Cars</a>
    </div>
  {:else}
    <div class="container mx-auto px-4">
      <!-- Vehicle Gallery -->
      <div class="mb-6">
        <div class="relative h-96 rounded-lg overflow-hidden cursor-pointer" on:click={openModal}>
          <img 
            src={$vehicleStore.currentVehicle.photos[currentImageIndex]} 
            alt={`${$vehicleStore.currentVehicle.make} ${$vehicleStore.currentVehicle.model}`}
            class="w-full h-full object-cover"
          />
          <button 
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition"
            on:click|stopPropagation={() => navigateImage(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition"
            on:click|stopPropagation={() => navigateImage(1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div class="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {currentImageIndex + 1}/{$vehicleStore.currentVehicle.photos.length}
          </div>
        </div>
        
        <!-- Thumbnails -->
        <div class="grid grid-cols-5 gap-2 mt-2">
          {#each $vehicleStore.currentVehicle.photos as photo, index}
            <div 
              class={`h-20 rounded overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-primary-500' : ''}`}
              on:click={() => currentImageIndex = index}
            >
              <img src={photo} alt="" class="w-full h-full object-cover" />
            </div>
          {/each}
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Vehicle Details -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-card p-6 mb-6">
            <div class="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 class="text-3xl font-bold mb-2">{$vehicleStore.currentVehicle.title}</h1>
                <p class="text-lg text-neutral-600">{$vehicleStore.currentVehicle.year} {$vehicleStore.currentVehicle.make} {$vehicleStore.currentVehicle.model}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-primary-600">{formatCurrency($vehicleStore.currentVehicle.pricePerDay)}<span class="text-sm font-normal text-neutral-600">/day</span></p>
                <div class="flex items-center justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1">{$vehicleStore.currentVehicle.averageRating.toFixed(1)} ({$vehicleStore.currentVehicle.reviews.length} reviews)</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center mb-4 text-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{$vehicleStore.currentVehicle.location.address}, {$vehicleStore.currentVehicle.location.city}, {$vehicleStore.currentVehicle.location.state} {$vehicleStore.currentVehicle.location.zipCode}</span>
            </div>
            
            <div class="flex space-x-6 py-4 border-t border-b border-neutral-200 mb-6">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{$vehicleStore.currentVehicle.seats} seats</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span>{$vehicleStore.currentVehicle.transmission}</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{$vehicleStore.currentVehicle.fuelType}</span>
              </div>
            </div>
            
            <!-- Tabs Navigation -->
            <div class="border-b border-neutral-200 mb-6">
              <div class="flex space-x-8">
                <button 
                  class={`pb-3 text-sm font-medium ${selectedTab === 'details' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600 hover:text-neutral-800'}`}
                  on:click={() => selectedTab = 'details'}
                >
                  Details
                </button>
                <button 
                  class={`pb-3 text-sm font-medium ${selectedTab === 'features' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600 hover:text-neutral-800'}`}
                  on:click={() => selectedTab = 'features'}
                >
                  Features
                </button>
                <button 
                  class={`pb-3 text-sm font-medium ${selectedTab === 'reviews' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-600 hover:text-neutral-800'}`}
                  on:click={() => selectedTab = 'reviews'}
                >
                  Reviews ({$vehicleStore.currentVehicle.reviews.length})
                </button>
              </div>
            </div>
            
            <!-- Tab Content -->
            {#if selectedTab === 'details'}
              <div>
                <h3 class="text-xl font-bold mb-4">About this car</h3>
                <p class="text-neutral-700 mb-6">{$vehicleStore.currentVehicle.description}</p>
                
                <h4 class="text-lg font-semibold mb-3">Host Information</h4>
                <div class="flex items-center mb-6">
                  <div class="h-12 w-12 rounded-full bg-neutral-300 mr-4 flex items-center justify-center text-white text-xl font-bold">
                    {$vehicleStore.currentVehicle.ownerName.charAt(0)}
                  </div>
                  <div>
                    <p class="font-medium">{$vehicleStore.currentVehicle.ownerName}</p>
                    <p class="text-sm text-neutral-600">Joined {new Date($vehicleStore.currentVehicle.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            {:else if selectedTab === 'features'}
              <div>
                <h3 class="text-xl font-bold mb-4">Features</h3>
                <div class="grid grid-cols-2 gap-y-3">
                  {#each $vehicleStore.currentVehicle.features as feature}
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {:else if selectedTab === 'reviews'}
              <div>
                <h3 class="text-xl font-bold mb-4">Reviews</h3>
                
                {#if $vehicleStore.currentVehicle.reviews.length === 0}
                  <p class="text-neutral-600">This vehicle has no reviews yet.</p>
                {:else}
                  <div class="space-y-6">
                    {#each $vehicleStore.currentVehicle.reviews as review (review.id)}
                      <div class="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                        <div class="flex items-center mb-3">
                          <div class="h-10 w-10 rounded-full overflow-hidden mr-3">
                            {#if review.userAvatar}
                              <img src={review.userAvatar} alt={review.userName} class="h-full w-full object-cover" />
                            {:else}
                              <div class="bg-neutral-300 h-full w-full flex items-center justify-center text-white text-sm font-bold">
                                {review.userName.charAt(0)}
                              </div>
                            {/if}
                          </div>
                          <div>
                            <p class="font-medium">{review.userName}</p>
                            <p class="text-sm text-neutral-500">{new Date(review.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div class="flex items-center mb-2">
                          {#each Array(5) as _, i}
                            <svg xmlns="http://www.w3.org/2000/svg" class={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-neutral-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          {/each}
                        </div>
                        
                        <p class="text-neutral-700">{review.comment}</p>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Booking Widget -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-card p-6 sticky top-24">
            <h3 class="text-xl font-bold mb-4">{formatCurrency($vehicleStore.currentVehicle.pricePerDay)}<span class="text-sm font-normal text-neutral-600">/day</span></h3>
            
            <div class="mb-4">
              <DateRangePicker bind:startDate bind:endDate on:change={handleDateChange} />
            </div>
            
            {#if totalDays > 0}
              <div class="border-t border-neutral-200 pt-4 mb-4">
                <div class="flex justify-between mb-2">
                  <span>{formatCurrency($vehicleStore.currentVehicle.pricePerDay)} × {totalDays} days</span>
                  <span>{formatCurrency($vehicleStore.currentVehicle.pricePerDay * totalDays)}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Service fee</span>
                  <span>{formatCurrency($vehicleStore.currentVehicle.pricePerDay * totalDays * 0.1)}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t border-neutral-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency($vehicleStore.currentVehicle.pricePerDay * totalDays * 1.1)}</span>
                </div>
              </div>
            {/if}
            
            <button type="button" class="btn btn-primary w-full mb-3">Reserve</button>
            
            <p class="text-center text-sm text-neutral-500 mb-4">You won't be charged yet</p>
            
            <div class="flex justify-center items-center space-x-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-neutral-700">Secure payment system</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Image Gallery Modal -->
  {#if isModalOpen && $vehicleStore.currentVehicle}
    <div class="fixed inset-0 bg-black z-50 flex justify-center items-center">
      <button 
        class="absolute top-4 right-4 bg-transparent text-white hover:text-neutral-300 focus:outline-none"
        on:click={closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button 
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
        on:click={() => navigateImage(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
        on:click={() => navigateImage(1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <img 
        src={$vehicleStore.currentVehicle.photos[currentImageIndex]} 
        alt={`${$vehicleStore.currentVehicle.make} ${$vehicleStore.currentVehicle.model}`}
        class="max-h-[90vh] max-w-[90vw] object-contain"
      />
      
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1}/{$vehicleStore.currentVehicle.photos.length}
      </div>
    </div>
  {/if}
</div>