<script>
  const testimonials = [
    {
      id: 1,
      text: "As a car owner, CarShare has been a fantastic way to offset the costs of owning a vehicle in the city. The platform is easy to use, and the support team is always available when needed.",
      author: "Michael Roberts",
      role: "Car Owner",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      text: "I don't own a car, but CarShare gives me access to one whenever I need it. The variety of vehicles and flexible booking options make it perfect for my lifestyle.",
      author: "Sophia Chen",
      role: "Renter",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      text: "The verification process gives me peace of mind when renting out my Tesla. I know my car is in good hands, and the insurance coverage is comprehensive.",
      author: "David Wilson",
      role: "Car Owner",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  ];
</script>

<section class="py-16 bg-neutral-900 text-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">What Our Users Say</h2>
      <p class="text-neutral-300 max-w-2xl mx-auto">Don't just take our word for it. Here's what our community of renters and car owners have to say about CarShare.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each testimonials as testimonial (testimonial.id)}
        <div class="bg-neutral-800 p-6 rounded-lg hover:bg-neutral-700 transition-colors duration-300">
          <div class="flex items-start mb-4">
            <div class="text-primary-500 text-4xl mr-2">"</div>
          </div>
          <p class="text-neutral-200 mb-6">{testimonial.text}</p>
          <div class="flex items-center">
            <img src={testimonial.avatar} alt={testimonial.author} class="w-12 h-12 rounded-full mr-4 object-cover" />
            <div>
              <h5 class="font-semibold">{testimonial.author}</h5>
              <p class="text-neutral-400 text-sm">{testimonial.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>