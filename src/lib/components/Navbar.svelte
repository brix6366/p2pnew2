<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { authStore } from '../stores/auth';
  import { slide } from 'svelte/transition'; // Import slide transition
  
  let isScrolled = false;
  let isMenuOpen = false;
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<nav class={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <Link to="/" class="flex items-center">
        <span class="text-2xl font-bold font-heading text-primary-600">WheelShare</span>
      </Link>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <Link to="/" class={`transition ${isScrolled ? 'text-neutral-800 hover:text-primary-600' : 'text-white hover:text-primary-200'}`}>Home</Link>
        <Link to="/search" class={`transition ${isScrolled ? 'text-neutral-800 hover:text-primary-600' : 'text-white hover:text-primary-200'}`}>Find Cars</Link>
        <Link to="/how-it-works" class={`transition ${isScrolled ? 'text-neutral-800 hover:text-primary-600' : 'text-white hover:text-primary-200'}`}>How it Works</Link>
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="relative">
            <button class={`flex items-center space-x-2 transition ${isScrolled ? 'text-neutral-800 hover:text-primary-600' : 'text-white hover:text-primary-200'}`}>
              <span>{$authStore.user.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <!-- Dropdown would go here -->
          </div>
          <Link to="/listings/new" class="btn btn-primary">List Your Car</Link>
        {:else}
          <Link to="/login" class={`transition ${isScrolled ? 'text-neutral-800 hover:text-primary-600' : 'text-white hover:text-primary-200'}`}>Sign in</Link>
          <Link to="/register" class="btn btn-primary">Register</Link>
        {/if}
      </div>
      
      <!-- Mobile menu button -->
      <button on:click={toggleMenu} class={`md:hidden focus:outline-none transition ${isScrolled ? 'text-neutral-800' : 'text-white'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Mobile menu -->
  {#if isMenuOpen}
    <div class="md:hidden bg-white border-t animate-enter"
         transition:slide>
      <div class="container mx-auto px-4 py-4 space-y-3">
        <Link to="/" class="block py-2 text-neutral-800 hover:text-primary-600" on:click={closeMenu}>Home</Link>
        <Link to="/search" class="block py-2 text-neutral-800 hover:text-primary-600" on:click={closeMenu}>Find Cars</Link>
        <Link to="/how-it-works" class="block py-2 text-neutral-800 hover:text-primary-600" on:click={closeMenu}>How it Works</Link>
        {#if $authStore.isAuthenticated && $authStore.user}
          <Link to="/account" class="block py-2 text-neutral-800 hover:text-primary-600" on:click={closeMenu}>{$authStore.user.name}'s Account</Link>
          <Link to="/listings/new" class="block py-2 text-primary-600 font-medium" on:click={closeMenu}>List Your Car</Link>
        {:else}
          <Link to="/login" class="block py-2 text-neutral-800 hover:text-primary-600" on:click={closeMenu}>Sign in</Link>
          <Link to="/register" class="block py-2 text-primary-600 font-medium" on:click={closeMenu}>Register</Link>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Add transitions for mobile menu */
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .slide-enter, .slide-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
</style>
