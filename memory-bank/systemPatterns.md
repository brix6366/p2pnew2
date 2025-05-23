# System Patterns: p2p-carrental

## 1. Backend Architecture Overview

The backend will follow a monolithic architecture initially, built with Node.js and Express.js. It will be structured using a modular approach, separating concerns into routes, controllers, services, and models.

```mermaid
graph TD
    A[Client (Svelte Frontend)] --> B{API Gateway / Load Balancer (Future)};
    B --> C[Express.js App];
    C --> D[Auth Middleware];
    D --> E[Routes];
    E --> F[Controllers];
    F --> G[Services];
    G --> H[Models (Mongoose)];
    H --> I[MongoDB Database];
    G --> J[Stripe API (Payments)];

    subgraph ExpressApp [Node.js/Express Backend]
        C
        D
        E
        F
        G
        H
    end

    subgraph ExternalServices
        I
        J
    end
```

## 2. Key Architectural Patterns

*   **Model-View-Controller (MVC)-like (for Backend):**
    *   **Models:** Mongoose schemas defining the structure of data (Users, Cars, Bookings, Payments).
    *   **Controllers:** Handle incoming HTTP requests, validate input (delegated or direct), call service methods, and formulate HTTP responses.
    *   **Services (Business Logic Layer):** Encapsulate business logic, interact with models for database operations, and integrate with external services like Stripe. This layer helps keep controllers thin.
*   **RESTful APIs:** Adherence to REST principles for API design (standard HTTP methods, statelessness, resource-based URLs).
*   **Middleware:** Express middleware will be used for:
    *   Authentication (JWT verification).
    *   Request logging.
    *   Error handling.
    *   Input validation (potentially).
    *   CORS.
*   **Dependency Injection (Implicit):** While Node.js doesn't have explicit DI frameworks like some other languages, the modular structure allows for dependencies (like services or models) to be required/imported where needed.

## 3. Data Flow Examples

### User Registration:
1.  Frontend sends POST request to `/api/auth/register` with user details.
2.  Auth Route (`auth.js`) directs to Auth Controller.
3.  Auth Controller validates input.
4.  Auth Controller calls AuthService to handle user creation logic.
5.  AuthService hashes password, creates User model instance, saves to MongoDB.
6.  AuthService generates JWT.
7.  Auth Controller sends JWT and user info back to frontend.

### Creating a Car Listing:
1.  Authenticated user (frontend) sends POST request to `/api/cars` with car details.
2.  Auth Middleware verifies JWT.
3.  Car Route directs to Car Controller.
4.  Car Controller validates input.
5.  Car Controller calls CarService.
6.  CarService creates Car model instance (associating with the owner/user), saves to MongoDB.
7.  Car Controller sends success response/created car data.

### Processing a Booking Payment:
1.  Authenticated user (frontend) initiates booking, proceeds to payment.
2.  Frontend sends POST request to `/api/bookings/pay` (or similar) with booking details and payment token (e.g., from Stripe.js).
3.  Auth Middleware verifies JWT.
4.  Booking Route directs to Booking/Payment Controller.
5.  Controller validates input.
6.  Controller calls PaymentService.
7.  PaymentService interacts with Stripe API to process payment.
8.  PaymentService updates Booking status in MongoDB (e.g., to 'confirmed').
9.  Controller sends success/failure response.

## 4. Directory Structure (Proposed for Backend Expansion)

This will build upon the existing `p2p-carrental-auth-setup/backend/` structure.

```
p2p-carrental-auth-setup/
└── backend/
    ├── config/
    │   ├── db.js           # MongoDB connection
    │   └── stripe.js       # Stripe configuration (new)
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── carController.js    # New
    │   └── bookingController.js # New
    │   └── paymentController.js # New (or integrated into booking)
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── validationMiddleware.js # New (for request validation)
    │   └── errorMiddleware.js      # New (centralized error handling)
    ├── models/
    │   ├── User.js
    │   ├── Car.js          # New
    │   └── Booking.js      # New
    │   └── Payment.js      # New (or embedded in Booking)
    ├── routes/
    │   ├── auth.js
    │   ├── users.js
    │   ├── cars.js         # New
    │   └── bookings.js     # New
    │   └── payments.js     # New
    ├── services/           # New (for business logic)
    │   ├── authService.js
    │   ├── userService.js
    │   ├── carService.js
    │   ├── bookingService.js
    │   └── paymentService.js # (Stripe interactions)
    ├── utils/              # New (helper functions, e.g., email, image upload)
    │   └── ...
    ├── .env                # Environment variables
    ├── server.js           # Main Express server setup
    └── package.json
```

## 5. Future Considerations
*   **Microservices:** If the application grows significantly, consider breaking down functionalities (e.g., payments, notifications) into separate microservices.
*   **Caching:** Implement caching strategies (e.g., Redis) for frequently accessed data to improve performance.
*   **Real-time Communication:** For features like chat or live notifications, WebSockets (e.g., Socket.IO) might be needed.
