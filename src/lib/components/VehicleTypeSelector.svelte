<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selectedType: string | null = null;
  
  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', icon: 'M10 18a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 0110 18zM7.75 15.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM13 15.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H13zM9.75 13a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zM7 12.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H7zM9.75 4a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7A.75.75 0 019.75 4zM7 3.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H7z' },
    { id: 'suv', name: 'SUV', icon: 'M15.75 5h-6V.75A.75.75 0 008.25 0h-3a.75.75 0 00-.75.75V5H.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75H4.5v9.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V9.5h15a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-9z' },
    { id: 'truck', name: 'Truck', icon: 'M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z' },
    { id: 'van', name: 'Van', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H6.9c-.59 0-1.146.279-1.5.75l-1.5 2.25a1.5 1.5 0 01-.832.75c-.364.097-.737.148-1.118.15-.188.001-.313.128-.315.315L1.5 16.5' },
    { id: 'luxury', name: 'Luxury', icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z' },
    { id: 'convertible', name: 'Convertible', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
    { id: 'sports', name: 'Sports', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
    { id: 'other', name: 'Other', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' }
  ];
  
  function selectType(type: string) {
    selectedType = selectedType === type ? null : type;
    dispatch('select', selectedType);
  }
</script>

<div class="mb-8">
  <h3 class="text-lg font-semibold mb-4">Vehicle Type</h3>
  <div class="grid grid-cols-4 gap-3">
    {#each vehicleTypes as type}
      <button 
        class={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${selectedType === type.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'}`}
        on:click={() => selectType(type.id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={type.icon} />
        </svg>
        <span class="text-sm">{type.name}</span>
      </button>
    {/each}
  </div>
</div>