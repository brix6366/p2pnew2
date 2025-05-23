const paymentService = require('../services/paymentService');
// const Booking = require('../models/Booking');

/**
 * @route   POST api/payments/create-checkout-session
 * @desc    Create a Stripe Checkout session for a booking
 * @access  Private (Renter of the booking)
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!bookingId) {
      const err = new Error('Booking ID is required.');
      err.statusCode = 400;
      return next(err);
    }

    const stripeSession = await paymentService.createCheckoutSession(bookingId, userId);
    
    // The stripeSession object contains various details, including the URL for redirection.
    // For a typical Stripe Checkout flow, you'd send the session ID or the URL to the client.
    // Sending the URL is often easier for client-side redirection.
    res.status(200).json({
      success: true,
      message: 'Stripe Checkout session created successfully.',
      sessionId: stripeSession.id, // Client can use this ID to redirect to Stripe Checkout
      sessionUrl: stripeSession.url // Or directly provide the URL
    });
  } catch (error) {
    // Handle CastError if bookingId is not a valid ObjectId format
    if (error.name === 'CastError' && error.path === '_id') { 
        const err = new Error(`Invalid booking ID format: ${req.body.bookingId}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error); // Pass other errors to global error handler
  }
};

/**
 * @route   POST api/payments/webhook
 * @desc    Stripe webhook endpoint to handle payment events
 * @access  Public (Secured by Stripe signature)
 */
exports.handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  // req.rawBody is populated by express.raw({type: 'application/json'}) middleware
  // which should be applied specifically to this route in server.js or payments.js
  const rawBody = req.rawBody; 

  if (!sig || !rawBody) {
    console.warn('Stripe webhook called without signature or raw body.');
    // It's important not to pass this to next(err) in a way that reveals internal details
    // to a potentially malicious caller who isn't Stripe.
    return res.status(400).send('Webhook Error: Missing signature or body.');
  }
  
  try {
    await paymentService.handleWebhookEvent(rawBody, sig);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error in Stripe webhook controller:', error.message);
    // Send appropriate status code based on the error from the service
    // If it's a signature verification error (400) or a server error (500)
    // Stripe will retry 5xx errors.
    res.status(error.statusCode || 500).send(`Webhook Error: ${error.message}`);
  }
};
