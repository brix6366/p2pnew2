const Stripe = require('stripe');

let stripeInstance;

if (process.env.STRIPE_SECRET_KEY) {
  stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("Stripe SDK initialized successfully.");
} else {
  console.error("Stripe secret key (STRIPE_SECRET_KEY) not found in environment variables. Payment functionality will be disabled.");
  // You might want to throw an error here or handle it in a way that
  // makes it clear that payments won't work, e.g., by setting stripeInstance to null
  // and checking for its existence in services.
  stripeInstance = null; 
}

module.exports = stripeInstance;
