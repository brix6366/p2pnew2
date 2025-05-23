<script lang="ts">
  import { Link } from 'svelte-routing';
  import { navigate } from 'svelte-routing';
  import { authStore } from '../../lib/stores/auth';
  
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let acceptTerms = false;
  let isLoading = false;
  let errorMessage = '';
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      errorMessage = 'Please fill in all fields';
      return;
    }
    
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }
    
    if (!acceptTerms) {
      errorMessage = 'Please accept the terms and conditions';
      return;
    }
    
    // Reset error message and set loading state
    errorMessage = '';
    isLoading = true;
    
    try {
      // This would be an API call in a real implementation
      // Simulate successful registration for demo
      setTimeout(() => {
        // Mock user data
        const user = {
          id: 'user123',
          name: name,
          email: email,
          isVerified: false,
          isOwner: false,
          createdAt: new Date()
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth store
        authStore.login(user);
        
        // Navigate to home page
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
  <div class="max-w-md w-full mx-auto">
    <div class="text-center mb-8">
      <Link to="/" class="text-3xl font-bold text-primary-600">WheelShare</Link>
      <h1 class="mt-6 text-3xl font-bold text-neutral-900">Create an account</h1>
      <p class="mt-2 text-neutral-600">
        Or <Link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">sign in to your account</Link>
      </p>
    </div>
    
    <div class="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
      {#if errorMessage}
        <div class="mb-4 p-4 bg-red-50 rounded-lg text-red-800 text-sm">
          {errorMessage}
        </div>
      {/if}
      
      <form class="space-y-6" on:submit={handleSubmit}>
        <div>
          <label for="name" class="form-label">Full name</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            autocomplete="name" 
            required 
            bind:value={name}
            class="form-input"
          />
        </div>
        
        <div>
          <label for="email" class="form-label">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            required 
            bind:value={email}
            class="form-input"
          />
        </div>
        
        <div>
          <label for="password" class="form-label">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            autocomplete="new-password" 
            required 
            bind:value={password}
            class="form-input"
          />
          <p class="mt-1 text-sm text-neutral-600">Must be at least 8 characters</p>
        </div>
        
        <div>
          <label for="confirm-password" class="form-label">Confirm password</label>
          <input 
            id="confirm-password" 
            name="confirm-password" 
            type="password" 
            required 
            bind:value={confirmPassword}
            class="form-input"
          />
        </div>
        
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              bind:checked={acceptTerms}
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-neutral-700">
              I agree to the 
              <Link to="/terms" class="text-primary-600 hover:text-primary-700">Terms of Service</Link>
              {' and '}
              <Link to="/privacy" class="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
            </label>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            class="btn btn-primary w-full flex justify-center items-center"
            disabled={isLoading}
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            {:else}
              Create account
            {/if}
          </button>
        </div>
      </form>
      
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button type="button" class="btn btn-outline flex justify-center">
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" class="btn btn-outline flex justify-center">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  </div>
</div>