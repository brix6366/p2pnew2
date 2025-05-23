<script lang="ts">
  import Hero from '../lib/components/Hero.svelte';
  import FeaturedVehicles from '../lib/components/FeaturedVehicles.svelte';
  import HowItWorks from '../lib/components/HowItWorks.svelte';
  import Testimonials from '../lib/components/Testimonials.svelte';
</script>

<div class="flex flex-col min-h-screen">
  <Hero />
  
  <FeaturedVehicles />
  
  <!-- Car types section -->
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Find Your Perfect Ride</h2>
        <p class="text-neutral-600 max-w-2xl mx-auto">We have vehicles for every occasion, from weekend getaways to business trips.</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/search?type=luxury" class="group relative h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <img src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Luxury" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute bottom-0 left-0 p-4 z-20 w-full">
            <h3 class="text-white text-xl font-bold">Luxury</h3>
            <p class="text-white/80 text-sm">Premium experiences for special occasions</p>
          </div>
        </a>
        
        <a href="/search?type=suv" class="group relative h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <img src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="SUVs" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute bottom-0 left-0 p-4 z-20 w-full">
            <h3 class="text-white text-xl font-bold">SUVs</h3>
            <p class="text-white/80 text-sm">Spacious and versatile for any adventure</p>
          </div>
        </a>
        
        <a href="/search?type=convertible" class="group relative h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <img src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Convertibles" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute bottom-0 left-0 p-4 z-20 w-full">
            <h3 class="text-white text-xl font-bold">Convertibles</h3>
            <p class="text-white/80 text-sm">Open-air driving experiences</p>
          </div>
        </a>
        
        <a href="/search?type=sedan" class="group relative h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <img src="https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Sedans" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute bottom-0 left-0 p-4 z-20 w-full">
            <h3 class="text-white text-xl font-bold">Sedans</h3>
            <p class="text-white/80 text-sm">Reliable and efficient daily drivers</p>
          </div>
        </a>
      </div>
    </div>
  </section>
  
  <HowItWorks />
  
  <!-- CTA Section -->
  <section class="py-20 bg-primary-600 text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to share your car?</h2>
        <p class="text-white/80 text-lg mb-8">Turn your car into an income-generating asset. Join thousands of car owners earning extra income every month.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/become-host" class="btn bg-white text-primary-600 hover:bg-neutral-100">Become a Host</a>
          <a href="/how-it-works" class="btn bg-transparent border border-white text-white hover:bg-white/10">Learn More</a>
        </div>
      </div>
    </div>
  </section>
  
  <Testimonials />
</div>