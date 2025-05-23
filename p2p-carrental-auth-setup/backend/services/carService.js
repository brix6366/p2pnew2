const Car = require('../models/Car');

/**
 * Create a new car listing.
 * @param {Object} carData - The data for the new car.
 * @param {String} carData.make
 * @param {String} carData.model
 * @param {Number} carData.year
 * @param {Number} carData.pricePerDay
 * @param {String} carData.location
 * @param {String} carData.description
 * @param {Array<String>} [carData.features]
 * @param {Array<String>} [carData.images]
 * @param {Boolean} [carData.isAvailable]
 * @param {String} carData.owner - The ID of the user owning the car.
 * @returns {Promise<Document>} The newly created car document.
 * @throws {Error} If there's an issue saving the car.
 */
exports.createCar = async (carData) => {
  try {
    const car = new Car(carData);
    await car.save();
    return car;
  } catch (error) {
    // Log the error or handle specific Mongoose validation errors if needed
    console.error("Error in carService.createCar:", error);
    // Re-throw the error to be caught by the controller or a global error handler
    // Or, throw a more specific custom error
    // For example: if (error.name === 'ValidationError') { throw new CustomError('Validation failed', 400); }
    throw error;
  }
};

// TODO: Implement other car service functions:

/**
 * Get all car listings with optional filtering and pagination.
 * @param {Object} filters - Filtering criteria (e.g., { make: 'Toyota', isAvailable: true }).
 * @param {Object} options - Pagination and sorting options (e.g., { limit: 10, skip: 0, sort: { pricePerDay: 1 } }).
 * @returns {Promise<Array<Document>>} A list of car documents.
 */
exports.getAllCars = async (filters = {}, options = {}) => {
  try {
    // Basic query without advanced filtering for now
    // Add .populate('owner', 'name email') to get owner details if needed
    const cars = await Car.find(filters)
      .sort(options.sort || { createdAt: -1 }) // Default sort by newest
      .skip(options.skip || 0)
      .limit(options.limit || 10); // Default limit to 10
    return cars;
  } catch (error) {
    console.error("Error in carService.getAllCars:", error);
    throw error;
  }
};

/**
 * Get a single car by its ID.
 * @param {String} carId - The ID of the car to retrieve.
 * @returns {Promise<Document|null>} The car document or null if not found.
 */
exports.getCarById = async (carId) => {
  try {
    // Add .populate('owner', 'name email') to get owner details if needed
    const car = await Car.findById(carId);
    return car; // Will be null if not found, controller should handle this
  } catch (error) {
    console.error("Error in carService.getCarById:", error);
    throw error;
  }
};

/**
 * Update an existing car listing.
 * @param {String} carId - The ID of the car to update.
 * @param {String} userId - The ID of the user attempting the update.
 * @param {Object} updateData - The fields to update.
 * @returns {Promise<Document|null>} The updated car document, or null if not found or not authorized.
 * @throws {Error} If car not found, user is not the owner, or update fails.
 */
exports.updateCar = async (carId, userId, updateData) => {
  try {
    const car = await Car.findById(carId);

    if (!car) {
      return null; // Or throw a specific "NotFound" error
    }

    // Check if the user attempting to update is the owner of the car
    if (car.owner.toString() !== userId) {
      const err = new Error('User not authorized to update this car');
      err.statusCode = 403; // Forbidden
      throw err;
    }

    // Update allowed fields (prevent owner field from being updated here)
    const allowedUpdates = ['make', 'model', 'year', 'pricePerDay', 'location', 'description', 'features', 'images', 'isAvailable'];
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        car[key] = updateData[key];
      }
    });

    await car.save();
    return car;
  } catch (error) {
    console.error("Error in carService.updateCar:", error);
    throw error; // Re-throw to be handled by controller
  }
};

/**
 * Delete a car listing.
 * @param {String} carId - The ID of the car to delete.
 * @param {String} userId - The ID of the user attempting the delete.
 * @returns {Promise<Document|null>} The deleted car document, or null if not found or not authorized.
 * @throws {Error} If car not found, user is not the owner, or deletion fails.
 */
exports.deleteCar = async (carId, userId) => {
  try {
    const car = await Car.findById(carId);

    if (!car) {
      return null; // Or throw a specific "NotFound" error
    }

    // Check if the user attempting to delete is the owner of the car
    if (car.owner.toString() !== userId) {
      const err = new Error('User not authorized to delete this car');
      err.statusCode = 403; // Forbidden
      throw err;
    }

    // Instead of car.remove(), findByIdAndDelete is often preferred
    const deletedCar = await Car.findByIdAndDelete(carId);
    return deletedCar; // Should return the document that was deleted
  } catch (error) {
    console.error("Error in carService.deleteCar:", error);
    throw error; // Re-throw to be handled by controller
  }
};

/**
 * Get all cars listed by a specific owner.
 * @param {String} ownerId - The ID of the owner.
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array<Document>>} A list of car documents owned by the user.
 */
exports.getCarsByOwner = async (ownerId, options = {}) => {
  try {
    const cars = await Car.find({ owner: ownerId })
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 10); // Default limit
    return cars;
  } catch (error) {
    console.error("Error in carService.getCarsByOwner:", error);
    throw error;
  }
};

// exports.searchCars = async (searchQuery, filters) => { /* ... */ };
