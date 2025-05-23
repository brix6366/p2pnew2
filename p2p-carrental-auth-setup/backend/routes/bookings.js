const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private (requires authentication)
router.post('/', authMiddleware, bookingController.createBooking);

// @route   GET api/bookings/user
// @desc    Get all bookings for the logged-in user (as renter)
// @access  Private
router.get('/user', authMiddleware, bookingController.getUserBookingsAsRenter);

// @route   GET api/bookings/owner
// @desc    Get all bookings for cars owned by the logged-in user
// @access  Private
router.get('/owner', authMiddleware, bookingController.getUserBookingsAsOwner);

// @route   GET api/bookings/:id
// @desc    Get a specific booking by ID
// @access  Private (only renter or owner of the car in the booking)
router.get('/:id', authMiddleware, bookingController.getBookingById);

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking (by renter or owner, with different logic)
// @access  Private
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// @route   PUT api/bookings/:id/confirm-pickup
// @desc    Confirm vehicle pickup (by renter or owner)
// @access  Private
// router.put('/:id/confirm-pickup', authMiddleware, bookingController.confirmPickup);

// @route   PUT api/bookings/:id/confirm-return
// @desc    Confirm vehicle return (by renter or owner)
// @access  Private
// router.put('/:id/confirm-return', authMiddleware, bookingController.confirmReturn);


// Placeholder route
router.get('/test', (req, res) => res.json({ msg: 'Booking routes are working' }));

module.exports = router;
