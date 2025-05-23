<script>
  const steps = [
    {
      title: "Find the perfect car",
      description: "Search our selection of vehicles by location, dates, and preferences to find your ideal match.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>`
    },
    {
      title: "Book instantly",
      description: "Reserve the vehicle of your choice with our secure booking system. No waiting for approval.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>`
    },
    {
      title: "Pick up the car",
      description: "Meet the owner at the agreed location, verify the vehicle, and start your journey.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
    },
    {
      title: "Return & rate",
      description: "Return the car at the scheduled time and share your experience with a review.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>`
    }
  ];
</script>

<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">How It Works</h2>
      <p class="text-neutral-600 max-w-2xl mx-auto">Renting a car has never been easier. Our simple process gets you on the road in no time.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each steps as step, index}
        <div class="bg-neutral-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
          <div class="absolute -top-4 -right-2 h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
            {index + 1}
          </div>
          <div class="text-primary-600 mb-4">
            {@html step.icon}
          </div>
          <h3 class="text-xl font-bold mb-2">{step.title}</h3>
          <p class="text-neutral-600">{step.description}</p>
        </div>
      {/each}
    </div>
    
    <div class="mt-12 text-center">
      <a href="/how-it-works" class="btn btn-outline">Learn More</a>
    </div>
  </div>
</section>