const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  renter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: { // Denormalizing owner for easier queries/notifications, could also be populated from Car
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending_payment', // Initial status when booking is created
      'confirmed',       // Payment successful, booking confirmed
      'active',          // Rental period is ongoing
      'completed',       // Rental period finished, car returned
      'cancelled_by_renter',
      'cancelled_by_owner',
      'payment_failed'
    ],
    default: 'pending_payment'
  },
  paymentIntentId: { type: String, trim: true }, // For Stripe PaymentIntent
  stripeCheckoutSessionId: { type: String, trim: true }, // For Stripe Checkout
  // Additional details that might be useful
  // pickupLocation: { type: String }, // If different from car's default or agreed upon
  // dropoffLocation: { type: String },
  // notesForOwner: { type: String },
  // notesForRenter: { type: String },
}, { timestamps: true });

// Ensure a car cannot be double-booked for the same period (simplified check)
// More robust checking should be done at the application/service layer before creating a booking.
// This index helps, but doesn't fully prevent overlaps if status isn't 'confirmed' or 'active'.
BookingSchema.index({ car: 1, startDate: 1, endDate: 1, status: 1 }, {
  unique: true,
  partialFilterExpression: { status: { $in: ['confirmed', 'active'] } }
});

// Index for renters to find their bookings
BookingSchema.index({ renter: 1, status: 1 });
// Index for owners to find bookings for their cars
BookingSchema.index({ owner: 1, status: 1 });


module.exports = mongoose.model('Booking', BookingSchema);
