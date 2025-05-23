const carService = require('../services/carService');
// const Car = require('../models/Car'); // Model might not be directly needed in controller if service handles all DB interaction

/**
 * @route   POST api/cars
 * @desc    Create a new car listing
 * @access  Private
 */
exports.createCar = async (req, res, next) => {
  try {
    // Basic validation (more robust validation should be done with a library or dedicated middleware)
    const { make, model, year, pricePerDay, location, description } = req.body;
    if (!make || !model || !year || !pricePerDay || !location || !description) {
      // Manually create an error object that errorMiddleware can understand
      const err = new Error('Missing required fields: make, model, year, pricePerDay, location, description');
      err.statusCode = 400;
      return next(err);
    }

    const carData = { ...req.body };
    carData.owner = req.user.id; // req.user is populated by authMiddleware

    const newCar = await carService.createCar(carData);
    
    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      data: newCar
    });
  } catch (error) {
    // Pass the error to the centralized error handling middleware
    // The error middleware will log it and send a generic response
    next(error);
  }
};

// TODO: Implement other car controller functions:

/**
 * @route   GET api/cars
 * @desc    Get all car listings
 * @access  Public
 */
exports.getAllCars = async (req, res, next) => {
  try {
    // Basic pagination and filtering can be passed from query params
    // e.g., /api/cars?limit=5&skip=10&make=Toyota&isAvailable=true
    const filters = { ...req.query }; // Copy query params
    const options = {};

    if (filters.limit) {
      options.limit = parseInt(filters.limit, 10);
      delete filters.limit;
    }
    if (filters.skip) {
      options.skip = parseInt(filters.skip, 10);
      delete filters.skip;
    }
    if (filters.sortBy) { // e.g. sortBy=pricePerDay:asc or pricePerDay:desc
        const parts = filters.sortBy.split(':');
        options.sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
        delete filters.sortBy;
    }
    
    // Convert boolean strings to booleans if they exist
    if (filters.isAvailable) filters.isAvailable = filters.isAvailable === 'true';


    const cars = await carService.getAllCars(filters, options);
    res.status(200).json({
      success: true,
      count: cars.length, // This count is for the current page, not total
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET api/cars/:id
 * @desc    Get a single car by ID
 * @access  Public
 */
exports.getCarById = async (req, res, next) => {
  try {
    const carId = req.params.id;
    const car = await carService.getCarById(carId);

    if (!car) {
      const err = new Error('Car not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    // Handle CastError if ID is not a valid ObjectId format
    if (error.name === 'CastError') {
      const err = new Error(`Invalid car ID format: ${req.params.id}`);
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

/**
 * @route   PUT api/cars/:id
 * @desc    Update a car listing
 * @access  Private (Owner only)
 */
exports.updateCar = async (req, res, next) => {
  try {
    const carId = req.params.id;
    const userId = req.user.id; // From authMiddleware
    const updateData = req.body;

    // Basic validation: ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      const err = new Error('No update data provided');
      err.statusCode = 400;
      return next(err);
    }

    const updatedCar = await carService.updateCar(carId, userId, updateData);

    if (!updatedCar) {
      // This case is theoretically handled by the service throwing an error if car not found or user not authorized.
      // However, if service returns null for "not found" specifically:
      const err = new Error('Car not found or user not authorized to update');
      err.statusCode = 404; // Or 403 if service distinguishes
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      data: updatedCar
    });
  } catch (error) {
    // Handle CastError if ID is not a valid ObjectId format
    if (error.name === 'CastError' && error.path === '_id') { // Check if CastError is for carId
        const err = new Error(`Invalid car ID format: ${req.params.id}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error); // Pass other errors (like auth error from service) to global error handler
  }
};

/**
 * @route   DELETE api/cars/:id
 * @desc    Delete a car listing
 * @access  Private (Owner only)
 */
exports.deleteCar = async (req, res, next) => {
  try {
    const carId = req.params.id;
    const userId = req.user.id; // From authMiddleware

    const deletedCar = await carService.deleteCar(carId, userId);

    if (!deletedCar) {
      // This case is theoretically handled by the service throwing an error if car not found or user not authorized.
      // However, if service returns null for "not found" specifically:
      const err = new Error('Car not found or user not authorized to delete');
      err.statusCode = 404; // Or 403 if service distinguishes
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully',
      data: deletedCar // Or simply a success message: { message: 'Car deleted' }
    });
  } catch (error) {
    // Handle CastError if ID is not a valid ObjectId format
    if (error.name === 'CastError' && error.path === '_id') { // Check if CastError is for carId
        const err = new Error(`Invalid car ID format: ${req.params.id}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error); // Pass other errors (like auth error from service) to global error handler
  }
};

/**
 * @route   GET api/cars/owner/:userId
 * @desc    Get all cars listed by a specific user
 * @access  Public (or Private, depending on requirements)
 */
exports.getCarsByOwner = async (req, res, next) => {
  try {
    const ownerId = req.params.userId; // Assuming userId in route is the owner's ID

    // Basic pagination can be passed from query params
    const options = {};
    if (req.query.limit) {
      options.limit = parseInt(req.query.limit, 10);
    }
    if (req.query.skip) {
      options.skip = parseInt(req.query.skip, 10);
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        options.sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    const cars = await carService.getCarsByOwner(ownerId, options);

    // It's okay if an owner has no cars, so an empty array is a valid response.
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    // Handle CastError if ownerId is not a valid ObjectId format
    if (error.name === 'CastError' && error.path === '_id') { // Check if CastError is for ownerId
        const err = new Error(`Invalid owner ID format: ${req.params.userId}`);
        err.statusCode = 400;
        return next(err);
    }
    next(error);
  }
};
