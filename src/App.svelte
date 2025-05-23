<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { authStore } from './lib/stores/auth';
  
  import Home from './pages/Home.svelte';
  import Login from './pages/Auth/Login.svelte';
  import Register from './pages/Auth/Register.svelte';
  import Search from './pages/Search/Search.svelte';
  import VehicleDetail from './pages/VehicleDetail.svelte';
  import Navbar from './lib/components/Navbar.svelte';
  import Footer from './lib/components/Footer.svelte';
  
  export let url = '';
  
  onMount(() => {
    // Check auth status on app load
    authStore.checkAuth();
  });
</script>

<Router {url}>
  <main>
    <Navbar />
    
    <div>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/search" component={Search} />
      <Route path="/vehicles/:id" let:params>
        <VehicleDetail id={params.id} />
      </Route>
    </div>
    
    <Footer />
  </main>
</Router>