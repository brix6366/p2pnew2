<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-neutral-900 text-white">
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h5 class="text-xl font-bold mb-4">WheelShare</h5>
        <p class="text-neutral-300">Peer-to-peer car rental platform connecting vehicle owners with people who need a ride.</p>
        <div class="mt-4 flex space-x-4">
          <a href="#" class="text-white hover:text-primary-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6a6 6 0 100-12 6 6 0 000 12zm0 0"/>
            </svg>
          </a>
          <a href="#" class="text-white hover:text-primary-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6a6 6 0 100-12 6 6 0 000 12zm0 0"/>
            </svg>
          </a>
          <a href="#" class="text-white hover:text-primary-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6a6 6 0 100-12 6 6 0 000 12zm0 0"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div>
        <h5 class="text-lg font-semibold mb-4">Company</h5>
        <ul class="space-y-2">
          <li><a href="/about" class="text-neutral-300 hover:text-white transition">About Us</a></li>
          <li><a href="/careers" class="text-neutral-300 hover:text-white transition">Careers</a></li>
          <li><a href="/blog" class="text-neutral-300 hover:text-white transition">Blog</a></li>
          <li><a href="/press" class="text-neutral-300 hover:text-white transition">Press</a></li>
        </ul>
      </div>
      
      <div>
        <h5 class="text-lg font-semibold mb-4">Support</h5>
        <ul class="space-y-2">
          <li><a href="/help" class="text-neutral-300 hover:text-white transition">Help Center</a></li>
          <li><a href="/safety" class="text-neutral-300 hover:text-white transition">Safety Center</a></li>
          <li><a href="/contact" class="text-neutral-300 hover:text-white transition">Contact Us</a></li>
          <li><a href="/accessibility" class="text-neutral-300 hover:text-white transition">Accessibility</a></li>
        </ul>
      </div>
      
      <div>
        <h5 class="text-lg font-semibold mb-4">Legal</h5>
        <ul class="space-y-2">
          <li><a href="/terms" class="text-neutral-300 hover:text-white transition">Terms of Service</a></li>
          <li><a href="/privacy" class="text-neutral-300 hover:text-white transition">Privacy Policy</a></li>
          <li><a href="/insurance" class="text-neutral-300 hover:text-white transition">Insurance Policy</a></li>
          <li><a href="/cookies" class="text-neutral-300 hover:text-white transition">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-neutral-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
      <p class="text-neutral-400">© {currentYear} WheelShare. All rights reserved.</p>
      <div class="mt-4 md:mt-0">
        <select class="bg-neutral-800 text-white px-4 py-2 rounded border border-neutral-700">
          <option value="en">English (US)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>
  </div>
</footer>