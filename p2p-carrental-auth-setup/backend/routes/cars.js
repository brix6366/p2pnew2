const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const carController = require('../controllers/carController');

// @route   POST api/cars
// @desc    Create a new car listing
// @access  Private (requires authentication)
router.post('/', authMiddleware, carController.createCar);

// @route   GET api/cars
// @desc    Get all car listings (publicly accessible, or add filters)
// @access  Public
router.get('/', carController.getAllCars);

// @route   GET api/cars/:id
// @desc    Get a specific car by ID
// @access  Public
router.get('/:id', carController.getCarById);

// @route   PUT api/cars/:id
// @desc    Update a car listing
// @access  Private (only owner of the car)
router.put('/:id', authMiddleware, carController.updateCar);

// @route   DELETE api/cars/:id
// @desc    Delete a car listing
// @access  Private (only owner of the car)
router.delete('/:id', authMiddleware, carController.deleteCar);

// @route   GET api/cars/owner/:userId
// @desc    Get all cars listed by a specific user
// @access  Public (or Private if only for the owner to see their own listings)
router.get('/owner/:userId', carController.getCarsByOwner);


// Placeholder route
router.get('/test', (req, res) => res.json({ msg: 'Car routes are working' }));

module.exports = router;
