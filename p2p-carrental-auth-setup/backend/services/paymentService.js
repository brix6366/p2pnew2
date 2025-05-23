const stripe = require('../config/stripe'); // Import initialized Stripe instance
const Booking = require('../models/Booking');
const Car = require('../models/Car'); // Needed for car details
const User = require('../models/User'); // May be needed for customer info
const mongoose = require('mongoose');

/**
 * Create a Stripe Checkout session for a booking.
 * @param {String} bookingId - The ID of the booking.
 * @param {String} userId - The ID of the user initiating the payment (should be the renter).
 * @returns {Promise<Stripe.Checkout.Session>} The Stripe Checkout session object.
 * @throws {Error} If Stripe is not initialized, booking not found/authorized, or session creation fails.
 */
exports.createCheckoutSession = async (bookingId, userId) => {
  if (!stripe) {
    const err = new Error('Stripe is not initialized. Payment processing is disabled.');
    err.statusCode = 500;
    throw err;
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const booking = await Booking.findById(bookingId)
      .populate('car') // Populate car details like name, price, images
      .populate('renter', 'email') // Populate renter's email
      .session(mongoSession);

    if (!booking) {
      const err = new Error('Booking not found.');
      err.statusCode = 404;
      throw err;
    }

    if (booking.renter._id.toString() !== userId) {
      const err = new Error('User not authorized to pay for this booking.');
      err.statusCode = 403;
      throw err;
    }

    if (booking.status !== 'pending_payment') {
      const err = new Error(`Booking is not pending payment. Current status: ${booking.status}`);
      err.statusCode = 400;
      throw err;
    }
    
    const car = booking.car; // Already populated

    // Prepare line items for Stripe Checkout
    const lineItems = [{
      price_data: {
        currency: process.env.CURRENCY || 'usd', // Default to USD if not set
        product_data: {
          name: `Booking for ${car.make} ${car.model}`,
          description: `Rental from ${booking.startDate.toLocaleDateString()} to ${booking.endDate.toLocaleDateString()}`,
          images: car.images && car.images.length > 0 ? [car.images[0]] : undefined,
        },
        unit_amount: Math.round(booking.totalPrice * 100), // Price in cents
      },
      quantity: 1,
    }];

    // Ensure FRONTEND_URL is set in .env
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'; // Fallback for local dev

    // Create Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendURL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${frontendURL}/payment-cancelled?booking_id=${bookingId}`,
      customer_email: booking.renter.email, // Prefill email
      client_reference_id: bookingId.toString(), // Store bookingId to identify it in webhook
      metadata: { bookingId: bookingId.toString() }
    });

    // Store stripeCheckoutSessionId in the booking document
    booking.stripeCheckoutSessionId = stripeSession.id;
    await booking.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    return stripeSession;

  } catch (error) {
    await mongoSession.abortTransaction();
    console.error("Error creating Stripe Checkout session:", error.message);
    if (!error.statusCode) error.statusCode = 500; // Default if not set by specific checks
    throw error;
  } finally {
    mongoSession.endSession();
  }
};

/**
 * Handle incoming Stripe webhook events.
 * @param {Buffer} rawBody - The raw request body from Stripe.
 * @param {String} sig - The Stripe signature from the request headers.
 * @throws {Error} If Stripe is not initialized, signature verification fails, or event processing fails.
 */
exports.handleWebhookEvent = async (rawBody, sig) => {
  if (!stripe) {
    const err = new Error('Stripe is not initialized. Cannot handle webhook.');
    err.statusCode = 500;
    throw err;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    const err = new Error('Stripe webhook secret is not configured.');
    err.statusCode = 500;
    console.error(err.message); // Log this critical configuration error
    throw err;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    const error = new Error('Webhook signature verification failed.');
    error.statusCode = 400;
    throw error;
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const bookingId = session.client_reference_id || (session.metadata ? session.metadata.bookingId : null);

        if (bookingId) {
          console.log(`Processing checkout.session.completed for booking ID: ${bookingId}`);
          const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
              status: 'confirmed',
              paymentIntentId: session.payment_intent // Store payment intent ID
            },
            { new: true, session: mongoSession }
          );
          if (updatedBooking) {
            console.log(`Booking ${bookingId} status updated to 'confirmed'. Payment Intent ID: ${session.payment_intent}`);
            // TODO: Notify user and car owner about successful payment and booking confirmation.
          } else {
            console.warn(`Booking not found for ID: ${bookingId} during checkout.session.completed handling.`);
          }
        } else {
          console.warn('checkout.session.completed event received without bookingId in client_reference_id or metadata.');
        }
        break;

      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object;
        const failedBookingId = failedSession.client_reference_id || (failedSession.metadata ? failedSession.metadata.bookingId : null);
        if (failedBookingId) {
          console.log(`Processing checkout.session.async_payment_failed for booking ID: ${failedBookingId}`);
          const failedUpdate = await Booking.findByIdAndUpdate(
            failedBookingId,
            { status: 'payment_failed' },
            { new: true, session: mongoSession }
          );
           if (failedUpdate) {
            console.log(`Booking ${failedBookingId} status updated to 'payment_failed'.`);
            // TODO: Notify user about payment failure.
           } else {
            console.warn(`Booking not found for ID: ${failedBookingId} during async_payment_failed handling.`);
           }
        } else {
            console.warn('checkout.session.async_payment_failed event received without bookingId.');
        }
        break;
      
      // TODO: Handle other relevant event types, e.g.,
      // case 'payment_intent.succeeded':
      // case 'payment_intent.payment_failed':
      // case 'charge.refunded': // For handling refunds

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
    await mongoSession.commitTransaction();
  } catch (error) {
    await mongoSession.abortTransaction();
    console.error("Error processing Stripe webhook event:", error.message);
    // Do not throw a generic error back to Stripe if it's a processing issue on our end,
    // unless it's something Stripe should retry (like a temporary DB issue).
    // Stripe expects a 2xx response to acknowledge receipt, or a 5xx to retry.
    // If it's a permanent issue (e.g., bad data), acknowledge receipt to prevent retries.
    // For simplicity here, we'll let errors propagate if they are critical.
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  } finally {
    mongoSession.endSession();
  }
};
