const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// @route   POST api/payments/create-checkout-session
// @desc    Create a Stripe Checkout session for a booking
// @access  Private
router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);

// Webhook route is now handled directly in server.js to ensure express.raw() is applied correctly.

// Placeholder route for other payment related actions if any in future (e.g. get payment history)
router.get('/test', (req, res) => res.json({ msg: 'Payment routes (excluding webhook) are working' }));

module.exports = router;
