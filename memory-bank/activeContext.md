# Active Context: p2p-carrental

## 1. Current Date
*   May 23, 2025

## 2. Current Task Focus
*   **Task:** Add a comprehensive backend to the "p2p-carrental" project.
*   **Details:**
    *   The existing project has a basic auth and CRUD setup in `p2p-carrental-auth-setup/backend/`.
    *   The new backend needs to be built using Node.js with Express, MongoDB, and JWT for authentication (extending existing).
    *   Stripe integration is required for payment processing.
    *   Core functionalities to implement:
        *   Car listings (CRUD for cars).
        *   Booking system (creating, managing bookings).
        *   Payment processing for bookings.
        *   User profile management (potentially extending existing user model).

## 3. Recent Activities & Decisions
*   **Memory Bank Initialization:** All core Memory Bank files created.
*   **Existing Backend Review:** Completed review of `p2p-carrental-auth-setup/backend/` files (`server.js`, `config/db.js`, `middleware/authMiddleware.js`, `models/User.js`, `routes/auth.js`).
*   **Backend Structure Setup:**
    *   Created `Car.js` and `Booking.js` models.
    *   Created `cars.js`, `bookings.js`, `payments.js` route files (with placeholders).
    *   Created `errorMiddleware.js` and `validationMiddleware.js` (placeholder).
    *   Created `controllers/` directory with `carController.js` (placeholder).
    *   Created `services/` directory with `carService.js` (placeholder).
    *   Updated `server.js` to use new routes and middleware.
*   **Car CRUD (Create):**
    *   Implemented `createCar` in `carService.js`.
    *   Implemented `createCar` in `carController.js`.
    *   Wired up `POST /api/cars` route in `cars.js`.
*   **Car CRUD (Read):**
    *   Implemented `getAllCars` and `getCarById` in `carService.js`.
    *   Implemented `getAllCars` and `getCarById` in `carController.js`.
    *   Wired up `GET /api/cars` and `GET /api/cars/:id` routes in `cars.js`.
*   **Car CRUD (Update):**
    *   Implemented `updateCar` in `carService.js` (with owner check).
    *   Implemented `updateCar` in `carController.js`.
    *   Wired up `PUT /api/cars/:id` route in `cars.js`.
*   **Car CRUD (Delete):**
    *   Implemented `deleteCar` in `carService.js`.
    *   Implemented `deleteCar` in `carController.js`.
    *   Wired up `DELETE /api/cars/:id` route in `cars.js`.
*   **Get Cars by Owner:**
    *   Implemented `getCarsByOwner` in `carService.js`.
    *   Implemented `getCarsByOwner` in `carController.js`.
    *   Wired up `GET /api/cars/owner/:userId` route in `cars.js`.

## 4. Next Immediate Steps
1.  **Basic Testing of Car CRUD Endpoints:**
    *   Manually test the following endpoints using a tool like Postman or Insomnia:
        *   `POST /api/auth/register` (to get a user and token)
        *   `POST /api/auth/login` (to get a token)
        *   `POST /api/cars` (as authenticated user)
        *   `GET /api/cars` (public)
        *   `GET /api/cars/:id` (public, using an ID from the created car)
        *   `GET /api/cars/owner/:userId` (public, using the ID of the registered user)
        *   `PUT /api/cars/:id` (as authenticated owner)
        *   `DELETE /api/cars/:id` (as authenticated owner)
2.  **Booking Management (Create):**
    *   Created placeholder `bookingController.js` and `bookingService.js`.
    *   Implemented `createBooking` in `bookingService.js` (with date validation, conflict check, price calculation, transaction).
    *   Implemented `createBooking` in `bookingController.js`.
    *   Wired up `POST /api/bookings` route in `bookings.js`.
3.  **Booking Management (Read):**
    *   Implemented `getBookingById`, `getUserBookingsAsRenter`, `getUserBookingsAsOwner` in `bookingService.js`.
    *   Implemented `getBookingById`, `getUserBookingsAsRenter`, `getUserBookingsAsOwner` in `bookingController.js`.
    *   Wired up `GET /api/bookings/:id`, `GET /api/bookings/user`, `GET /api/bookings/owner` routes in `bookings.js`.
4.  **Booking Management (Update/Cancel):**
    *   Implemented `cancelBooking` in `bookingService.js` and `bookingController.js`.
    *   Wired up `PUT /api/bookings/:id/cancel` route in `bookings.js`.
5.  **Basic Testing of Booking Endpoints (Create, Read, Cancel):**
    *   Manually test the following endpoints:
        *   `POST /api/bookings` (as authenticated user)
        *   `GET /api/bookings/user` (as authenticated user who made bookings)
        *   `GET /api/bookings/owner` (as authenticated user who owns cars with bookings)
        *   `GET /api/bookings/:id` (as renter or owner of the car in booking)
        *   `PUT /api/bookings/:id/cancel` (as renter or owner)
6.  **Payment Integration (Stripe Checkout Session):**
    *   Created placeholder `paymentController.js` and `paymentService.js`.
    *   Created `config/stripe.js` for Stripe SDK initialization (relies on `STRIPE_SECRET_KEY` env var).
    *   Implemented `createCheckoutSession` in `paymentService.js` and `paymentController.js`.
    *   Wired up `POST /api/payments/create-checkout-session` route in `payments.js`.
7.  **Stripe Webhook Handling:**
    *   Implemented `handleWebhookEvent` in `paymentService.js` to process `checkout.session.completed` and `checkout.session.async_payment_failed`.
    *   Implemented `handleStripeWebhook` in `paymentController.js`.
    *   Modified `server.js` to correctly apply `express.raw()` middleware for the `/api/payments/webhook` route before global `express.json()`.
    *   Removed webhook route from `routes/payments.js` as it's now in `server.js`.
    *   User needs to add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`, and `CURRENCY` to their `.env` file.
8.  **Basic Testing of Payment Flow:**
    *   Manually test creating a booking, then proceeding to payment via the `/api/payments/create-checkout-session` endpoint.
    *   Simulate a successful payment with Stripe CLI or test cards to trigger the webhook and verify booking status updates.
9.  **Next Steps (User Profile Enhancements / Supporting Components):**
    *   Review existing User Model for potential enhancements.
    *   Consider adding more robust input validation.
    *   Plan for testing (unit/integration).

## 5. Open Questions & Considerations
*   **User Input for Memory Bank:** The `projectbrief.md` and `productContext.md` have placeholder content that needs to be updated with specific project details from the user. (Will ask the user about this once initial setup is done).
*   **Specific fields for Car Model:** What attributes should a 'Car' have (e.g., make, model, year, price per day, location, availability, images, owner_id)?
*   **Specific fields for Booking Model:** What attributes should a 'Booking' have (e.g., car_id, renter_id, start_date, end_date, total_price, status (pending, confirmed, cancelled, completed), payment_id)?
*   **Stripe Integration Details:**
    *   What payment flow is desired (e.g., Stripe Checkout, Payment Intents)?
    *   How should payment confirmation and booking status be linked?
*   **Error Handling Strategy:** Define a consistent error handling mechanism and response format.
*   **Input Validation:** Determine the best approach for validating request data (e.g., using a library like `express-validator` or custom validation in services/controllers).
