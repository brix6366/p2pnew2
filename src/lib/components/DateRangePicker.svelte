<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { format } from 'date-fns';
  
  export let startDate: string = '';
  export let endDate: string = '';
  
  const dispatch = createEventDispatcher();
  
  // Format date for display
  function formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  }
  
  // Update start date and validate end date is after start
  function updateStartDate(e: Event) {
    const target = e.target as HTMLInputElement;
    startDate = target.value;
    
    // Ensure end date is not before start date
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      endDate = newEndDate.toISOString().slice(0, 10);
    }
    
    dispatch('change', { startDate, endDate });
  }
  
  // Update end date and validate it's after start date
  function updateEndDate(e: Event) {
    const target = e.target as HTMLInputElement;
    endDate = target.value;
    
    // Ensure start date is not after end date
    if (startDate && new Date(startDate) >= new Date(endDate)) {
      const newStartDate = new Date(endDate);
      newStartDate.setDate(newStartDate.getDate() - 1);
      startDate = newStartDate.toISOString().slice(0, 10);
    }
    
    dispatch('change', { startDate, endDate });
  }
</script>

<div class="flex flex-col sm:flex-row gap-4">
  <div class="w-full sm:w-1/2">
    <label for="start-date" class="form-label">From</label>
    <div class="relative">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      <input 
        type="date" 
        id="start-date" 
        value={startDate}
        min={new Date().toISOString().slice(0, 10)}
        on:change={updateStartDate}
        class="form-input pl-10"
      />
    </div>
    {#if startDate}
      <div class="text-sm text-neutral-600 mt-1">{formatDisplayDate(startDate)}</div>
    {/if}
  </div>
  
  <div class="w-full sm:w-1/2">
    <label for="end-date" class="form-label">Until</label>
    <div class="relative">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      <input 
        type="date" 
        id="end-date" 
        value={endDate}
        min={startDate || new Date().toISOString().slice(0, 10)}
        on:change={updateEndDate}
        class="form-input pl-10"
      />
    </div>
    {#if endDate}
      <div class="text-sm text-neutral-600 mt-1">{formatDisplayDate(endDate)}</div>
    {/if}
  </div>
</div>
