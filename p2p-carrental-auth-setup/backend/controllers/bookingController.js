const bookingService = require('../services/bookingService');
// const Car = require('../models/Car');
// const Booking = require('../models/Booking');

/**
 * @route   POST api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const renterId = req.user.id; // From authMiddleware

    // Basic validation
    if (!carId || !startDate || !endDate) {
      const err = new Error('Missing required fields: carId, startDate, endDate.');
      err.statusCode = 400;
      return next(err);
    }

    const bookingDetails = {
      carId,
      renterId,
      startDate,
      endDate
    };

    const newBooking = await bookingService.createBooking(bookingDetails);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully and is pending payment.',
      data: newBooking
    });
  } catch (error) {
    // Pass the error to the centralized error handling middleware
    // The error middleware will log it and send an appropriate response
    next(error);
  }
};

// TODO: Implement other booking controller functions:

/**
 * @route   GET api/bookings/:id
 * @desc    Get a specific booking by ID
 * @access  Private (Renter or Car Owner)
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // From authMiddleware

    const booking = await bookingService.getBookingById(bookingId, userId);

    if (!booking) {
      const err = new Error('Booking not found or user not authorized.');
      err.statusCode = 404; // Or 403 if service distinguishes
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
        const err = new Error(`Invalid booking ID format: ${req.params.id}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error);
  }
};

/**
 * @route   GET api/bookings/user
 * @desc    Get all bookings for the logged-in user (as renter)
 * @access  Private
 */
exports.getUserBookingsAsRenter = async (req, res, next) => {
  try {
    const renterId = req.user.id; // From authMiddleware
    const options = {};
    if (req.query.limit) options.limit = parseInt(req.query.limit, 10);
    if (req.query.skip) options.skip = parseInt(req.query.skip, 10);
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        options.sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    const bookings = await bookingService.getUserBookingsAsRenter(renterId, options);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET api/bookings/owner
 * @desc    Get all bookings for cars owned by the logged-in user
 * @access  Private
 */
exports.getUserBookingsAsOwner = async (req, res, next) => {
  try {
    const ownerId = req.user.id; // From authMiddleware
    const options = {};
    if (req.query.limit) options.limit = parseInt(req.query.limit, 10);
    if (req.query.skip) options.skip = parseInt(req.query.skip, 10);
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        options.sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }
    
    const bookings = await bookingService.getUserBookingsAsOwner(ownerId, options);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (Renter or Car Owner)
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // From authMiddleware

    const updatedBooking = await bookingService.cancelBooking(bookingId, userId);

    if (!updatedBooking) {
      // This case should ideally be handled by specific errors thrown from the service
      const err = new Error('Booking not found or user not authorized to cancel.');
      err.statusCode = 404; // Or 403
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: `Booking successfully updated to status: ${updatedBooking.status}`,
      data: updatedBooking
    });
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
        const err = new Error(`Invalid booking ID format: ${req.params.id}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error);
  }
};
