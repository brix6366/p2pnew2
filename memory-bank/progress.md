# Progress: p2p-carrental

## 1. Current Status (May 23, 2025)
*   **Overall:** Backend expansion project initiated. Memory Bank core files created.
*   **Existing Functionality:** Basic user authentication (register, login) and CRUD operations exist in `p2p-carrental-auth-setup/backend/`.
*   **New Backend Development:** Planning phase. Core structure and technologies defined.

## 2. What Works
*   Initial Memory Bank setup.
*   User registration and login (based on existing `p2p-carrental-auth-setup/`). (To be verified)

## 3. What's Left to Build (High-Level Backend Features)

### Core Modules:
*   **Car Management:**
    *   [x] Define Car Model (Mongoose Schema) - `p2p-carrental-auth-setup/backend/models/Car.js` created.
    *   [x] Implement Car CRUD Routes (POST, GET, PUT, DELETE /api/cars, GET /api/cars/owner/:userId) - `p2p-carrental-auth-setup/backend/routes/cars.js` created; POST, GET (all & by ID), PUT, DELETE, GET by owner implemented.
    *   [x] Implement Car Controllers (createCar, getAllCars, getCarById, updateCar, deleteCar, getCarsByOwner) - `p2p-carrental-auth-setup/backend/controllers/carController.js` created; all corresponding functions implemented.
    *   [x] Implement Car Services (business logic for car operations) - `p2p-carrental-auth-setup/backend/services/carService.js` created; all corresponding functions implemented.
    *   [ ] Add image upload functionality for car photos.
    *   [ ] Implement search and filtering for cars. (Basic filtering via query params in getAllCars is present)
*   **Booking Management:**
    *   [x] Define Booking Model (Mongoose Schema) - `p2p-carrental-auth-setup/backend/models/Booking.js` created.
    *   [~] Implement Booking Routes (e.g., POST /api/bookings, GET /api/bookings/user, GET /api/bookings/owner, GET /api/bookings/:id, PUT /api/bookings/:id/cancel) - `p2p-carrental-auth-setup/backend/routes/bookings.js` created; POST, GET, and PUT (cancel) routes implemented.
    *   [~] Implement Booking Controllers (createBooking, getBookingById, getUserBookingsAsRenter, getUserBookingsAsOwner, cancelBooking, updateBookingStatus) - `p2p-carrental-auth-setup/backend/controllers/bookingController.js` created; `createBooking`, `getBookingById`, `getUserBookingsAsRenter`, `getUserBookingsAsOwner`, `cancelBooking` implemented.
    *   [~] Implement Booking Services (handle booking logic, availability checks) - `p2p-carrental-auth-setup/backend/services/bookingService.js` created; `createBooking`, `getBookingById`, `getUserBookingsAsRenter`, `getUserBookingsAsOwner`, `cancelBooking` implemented.
*   **Payment Integration (Stripe):**
    *   [x] Configure Stripe (API keys in `.env`, Stripe client setup). - `config/stripe.js` created, relies on `STRIPE_SECRET_KEY` in `.env`. User also needs `STRIPE_WEBHOOK_SECRET`.
    *   [x] Define Payment Model/Schema (if needed, or embed in Booking). - `stripeCheckoutSessionId` and `paymentIntentId` added to `BookingModel`.
    *   [x] Implement Payment Routes (e.g., POST /api/payments/create-checkout-session, POST /api/payments/webhook). - `routes/payments.js` for checkout; webhook in `server.js`.
    *   [x] Implement Payment Controllers. - `controllers/paymentController.js` with `createCheckoutSession` and `handleStripeWebhook`.
    *   [x] Implement Payment Services (interact with Stripe API, handle webhooks for payment confirmation). - `services/paymentService.js` with `createCheckoutSession` and `handleWebhookEvent`.
    *   [x] Link payments to bookings (update booking status on successful payment). - Implemented via webhook handler.
*   **User Profile Enhancements:**
    *   [ ] Review existing User Model.
    *   [ ] Add fields if necessary (e.g., profile picture, owned cars, rental history).
    *   [ ] Implement routes/controllers/services for managing user profiles.

### Supporting Components:
*   [ ] **Enhanced Authentication/Authorization:**
    *   [ ] Role-based access control (e.g., car owner vs. renter vs. admin - if needed).
    *   [ ] Protect routes based on user roles.
*   [ ] **Input Validation:** Implement robust validation for all API endpoints.
*   [ ] **Centralized Error Handling:** Implement consistent error responses.
*   [ ] **API Documentation:** (e.g., using Swagger/OpenAPI or Postman collections).
*   [ ] **Testing:**
    *   [ ] Unit tests for services.
    *   [ ] Integration tests for API endpoints.

## 4. Known Issues & Blockers
*   **Placeholder Content in Memory Bank:** `projectbrief.md` and `productContext.md` need specific details from the user.
*   **Detailed Requirements for Models:** Specific fields for Car and Booking models need to be defined.
*   **Stripe Payment Flow:** The exact Stripe payment flow (Checkout, Payment Intents, etc.) needs to be decided.

## 5. Milestones (Tentative)

*   **Milestone 1: Core Backend Setup & Car CRUD**
    *   [x] Review existing auth.
    *   [x] Setup new backend directory structure and core files (models, routes, controllers, services, middleware placeholders).
    *   [x] Implement full CRUD for Car listings - Create, Read, Update, Delete operations for Cars are implemented.
*   **Milestone 2: Booking System (No Payment)**
    *   [~] Implement Booking model and basic booking logic (create, view, cancel). - Create, Read, and Cancel operations for bookings implemented. Other updates (confirm pickup/return) pending.
    *   [ ] Car availability checks.
*   **Milestone 3: Stripe Payment Integration**
    *   [x] Integrate Stripe for processing booking payments. - Checkout session creation and webhook handling implemented.
    *   [x] Link payment status to booking confirmation. - Implemented via webhook.
*   **Milestone 4: Enhancements & Refinements**
    *   [ ] User profile updates.
    *   [ ] Advanced search/filtering.
    *   [ ] Robust error handling and validation.
*   **Milestone 5: Testing & Documentation**
    *   [ ] Write unit and integration tests.
    *   [ ] Prepare API documentation.

This `progress.md` will be updated as tasks are completed and new ones are identified.
