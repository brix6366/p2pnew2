const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

const paymentController = require('./controllers/paymentController'); // Import paymentController

// Middleware

// Stripe Webhook Route - needs to be defined before express.json() to access raw body
// It also should not go through the global validation middleware if that middleware relies on req.body being JSON
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), paymentController.handleStripeWebhook);

app.use(cors());
app.use(express.json()); // This will parse JSON for all subsequent routes

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments')); // This will now handle routes other than /webhook

// Placeholder for general validation middleware (can be applied per route or specifically)
// Note: If this middleware relies on req.body being JSON, it should come after express.json()
// and potentially after the webhook route if the webhook shouldn't be validated by it.
const validationMiddleware = require('./middleware/validationMiddleware');
app.use(validationMiddleware);

// Error Handling Middleware (should be last, after all routes and other middleware)
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
