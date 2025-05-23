const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  location: { // Simple text field for now, can be expanded to an object with address components
    type: String,
    required: true,
    trim: true
  },
  description: { type: String, required: true, trim: true },
  features: [{ type: String, trim: true }], // e.g., ["GPS", "Sunroof", "Bluetooth"]
  images: [{ type: String, trim: true }], // Array of URLs to images
  isAvailable: { type: Boolean, default: true }, // Simple availability flag
  // For more complex availability, consider a separate schema or array of available date ranges
  // availability: [{ startDate: Date, endDate: Date }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Future fields:
  // licensePlate: { type: String, unique: true, sparse: true }, // sparse allows nulls not to violate unique constraint
  // vin: { type: String, unique: true, sparse: true },
  // insuranceDetails: { type: String },
  // ratings: [{ userId: Schema.Types.ObjectId, rating: Number, comment: String }],
  // averageRating: { type: Number, default: 0 },
}, { timestamps: true });

// Index for searching by make, model, location (can be expanded)
CarSchema.index({ make: 'text', model: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Car', CarSchema);
