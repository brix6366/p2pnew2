const Booking = require('../models/Booking');
const Car = require('../models/Car');
const mongoose = require('mongoose');

/**
 * Create a new booking.
 * @param {Object} bookingDetails - Details for the new booking.
 * @param {String} bookingDetails.carId - ID of the car to book.
 * @param {String} bookingDetails.renterId - ID of the user making the booking.
 * @param {Date} bookingDetails.startDate - Start date of the booking.
 * @param {Date} bookingDetails.endDate - End date of the booking.
 * @returns {Promise<Document>} The newly created booking document.
 * @throws {Error} If car not found, not available, date conflicts, or other issues.
 */
exports.createBooking = async (bookingDetails) => {
  const { carId, renterId, startDate, endDate } = bookingDetails;

  const session = await mongoose.startSession(); // For transaction
  session.startTransaction();

  try {
    // 1. Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      const err = new Error('End date must be after start date.');
      err.statusCode = 400;
      throw err;
    }
    if (new Date(startDate) < new Date()) {
        const err = new Error('Start date cannot be in the past.');
        err.statusCode = 400;
        throw err;
    }

    // 2. Fetch the car and check its general availability flag
    const car = await Car.findById(carId).session(session);
    if (!car) {
      const err = new Error('Car not found.');
      err.statusCode = 404;
      throw err;
    }
    if (!car.isAvailable) { // General availability flag
      const err = new Error('Car is currently not available for booking.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Check for booking conflicts for the specific dates
    // A car is considered unavailable if there's any existing 'confirmed' or 'active' booking
    // that overlaps with the requested period.
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['confirmed', 'active'] }, // Only consider confirmed/active bookings
      $or: [
        // Case 1: Existing booking starts during new booking
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        // Case 2: Existing booking ends during new booking
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        // Case 3: Existing booking encapsulates new booking
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
      ]
    }).session(session);

    if (conflictingBooking) {
      const err = new Error('Car is not available for the selected dates due to an existing booking.');
      err.statusCode = 409; // Conflict
      throw err;
    }

    // 4. Calculate total price
    const durationInMilliseconds = new Date(endDate) - new Date(startDate);
    const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Use Math.ceil for partial days
    if (durationInDays <= 0) { // Should be caught by earlier date validation, but good to double check
        const err = new Error('Booking duration must be at least one day.');
        err.statusCode = 400;
        throw err;
    }
    const totalPrice = durationInDays * car.pricePerDay;

    // 5. Create the booking
    const newBooking = new Booking({
      car: carId,
      renter: renterId,
      owner: car.owner, // Denormalize owner from car for easier access
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: 'pending_payment' // Initial status
    });

    await newBooking.save({ session });

    // Note: For a real application, you might temporarily mark the car as "pending"
    // or reduce available quantity if you manage inventory that way,
    // or rely on the 'pending_payment' status of the booking itself.
    // If payment fails, the booking status would change, and the slot becomes available again.

    await session.commitTransaction();
    return newBooking;

  } catch (error) {
    await session.abortTransaction();
    console.error("Error in bookingService.createBooking:", error.message);
    // Ensure statusCode is propagated if set, otherwise it might default to 500 in controller
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  } finally {
    session.endSession();
  }
};

// TODO: Implement other booking service functions:

/**
 * Get a booking by its ID.
 * Ensures the user requesting is either the renter or the owner of the car in the booking.
 * @param {String} bookingId - The ID of the booking.
 * @param {String} userId - The ID of the user requesting the booking.
 * @returns {Promise<Document|null>} The booking document or null if not found or not authorized.
 */
exports.getBookingById = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('car', 'make model year owner') // Populate car details, including its owner
      .populate('renter', 'name email')
      .populate('owner', 'name email'); // This is the car's owner, denormalized in booking

    if (!booking) {
      return null;
    }

    // Authorization: User must be the renter or the owner of the car associated with the booking
    if (booking.renter._id.toString() !== userId && booking.owner._id.toString() !== userId) {
      const err = new Error('User not authorized to view this booking.');
      err.statusCode = 403;
      throw err;
    }
    return booking;
  } catch (error) {
    console.error("Error in bookingService.getBookingById:", error.message);
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  }
};

/**
 * Get all bookings made by a specific user (as a renter).
 * @param {String} renterId - The ID of the renter.
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array<Document>>} A list of booking documents.
 */
exports.getUserBookingsAsRenter = async (renterId, options = {}) => {
  try {
    const bookings = await Booking.find({ renter: renterId })
      .populate('car', 'make model year images pricePerDay location') // Populate some car details
      .populate('owner', 'name email') // Car owner details
      .sort(options.sort || { startDate: -1 }) // Default sort by most recent start date
      .skip(options.skip || 0)
      .limit(options.limit || 10);
    return bookings;
  } catch (error) {
    console.error("Error in bookingService.getUserBookingsAsRenter:", error.message);
    throw error;
  }
};

/**
 * Get all bookings for cars owned by a specific user.
 * @param {String} ownerId - The ID of the car owner.
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array<Document>>} A list of booking documents.
 */
exports.getUserBookingsAsOwner = async (ownerId, options = {}) => {
  try {
    const bookings = await Booking.find({ owner: ownerId }) // 'owner' here is the denormalized car.owner
      .populate('car', 'make model year images')
      .populate('renter', 'name email') // Renter details
      .sort(options.sort || { startDate: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 10);
    return bookings;
  } catch (error) {
    console.error("Error in bookingService.getUserBookingsAsOwner:", error.message);
    throw error;
  }
};

/**
 * Cancel a booking.
 * Logic depends on who is cancelling (renter or owner) and booking status/timing.
 * @param {String} bookingId - The ID of the booking to cancel.
 * @param {String} userId - The ID of the user attempting to cancel.
 * @returns {Promise<Document|null>} The updated booking document or null if not found/not authorized.
 * @throws {Error} If booking cannot be cancelled or user not authorized.
 */
exports.cancelBooking = async (bookingId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findById(bookingId).populate('car').session(session);

    if (!booking) {
      const err = new Error('Booking not found.');
      err.statusCode = 404;
      throw err;
    }

    const isRenter = booking.renter.toString() === userId;
    const isOwner = booking.owner.toString() === userId; // car.owner was denormalized to booking.owner

    if (!isRenter && !isOwner) {
      const err = new Error('User not authorized to cancel this booking.');
      err.statusCode = 403;
      throw err;
    }

    // Define cancellable statuses
    const cancellableStatuses = ['pending_payment', 'confirmed'];
    if (!cancellableStatuses.includes(booking.status)) {
      const err = new Error(`Booking cannot be cancelled in its current status: ${booking.status}.`);
      err.statusCode = 400;
      throw err;
    }
    
    // Add time-based cancellation policies if needed
    // For example, renter can cancel up to 24 hours before startDate if booking is 'confirmed'
    // if (isRenter && booking.status === 'confirmed') {
    //   const now = new Date();
    //   const timeDiff = booking.startDate.getTime() - now.getTime();
    //   const hoursBeforeStart = timeDiff / (1000 * 60 * 60);
    //   if (hoursBeforeStart < 24) {
    //     const err = new Error('Booking cannot be cancelled less than 24 hours before start time.');
    //     err.statusCode = 400;
    //     throw err;
    //   }
    // }

    booking.status = isRenter ? 'cancelled_by_renter' : 'cancelled_by_owner';
    
    // TODO: Handle refund logic if payment was already made.
    // This would typically involve interacting with Stripe if status was 'confirmed'.
    // For now, we just update the status. If Stripe is integrated, a refund call would go here.
    // If a refund fails, the transaction should be rolled back.

    await booking.save({ session });
    
    // Potentially make the car available again if this cancellation frees it up.
    // This depends on how car.isAvailable is managed. If it's a simple flag,
    // and this was the only booking making it unavailable, set car.isAvailable = true.
    // For simplicity, we are not managing car.isAvailable based on individual bookings here.

    await session.commitTransaction();
    return booking;

  } catch (error) {
    await session.abortTransaction();
    console.error("Error in bookingService.cancelBooking:", error.message);
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  } finally {
    session.endSession();
  }
};

// exports.updateBookingStatus = async (bookingId, newStatus, paymentDetails) => { /* ... for payment success/failure ... */ };
