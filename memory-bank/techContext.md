# Technical Context: p2p-carrental

## 1. Technology Stack

### Backend:
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Payment Processing:** Stripe API

### Frontend (Based on existing project structure):
*   **Framework/Library:** Svelte (likely with SvelteKit if routing and SSR/SSG are involved)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Build Tool:** Vite

### General:
*   **Version Control:** Git
*   **Package Managers:** npm (for both frontend and backend)

## 2. Development Environment Setup

*   **Node.js:** Required for running the backend server and frontend build tools.
*   **MongoDB:** A local or cloud-hosted MongoDB instance is needed. Connection details will be stored in a `.env` file.
*   **Stripe Account:** A Stripe developer account is necessary to obtain API keys for payment integration. These keys will also be stored in the `.env` file.
*   **Code Editor:** VS Code (or preferred editor with relevant extensions for JavaScript/TypeScript, Svelte, Tailwind CSS).
*   **Terminal/CLI:** For running commands (npm scripts, git, etc.).

## 3. Key Technical Decisions (Initial)

*   **Monolithic Backend (initially):** The backend services (auth, cars, bookings, payments) will reside within a single Node.js/Express application. This can be re-evaluated for microservices if complexity grows significantly.
*   **RESTful APIs:** Backend will expose RESTful APIs for frontend consumption.
*   **Environment Variables:** Sensitive information (database URIs, API keys, JWT secrets) will be managed using environment variables (e.g., via a `.env` file and `dotenv` package).
*   **Existing Auth:** The current authentication setup in `p2p-carrental-auth-setup/backend/` will be the starting point and will be expanded upon.

## 4. Dependencies (High-Level)

### Backend:
*   `express`: Web framework
*   `mongoose`: MongoDB object modeling
*   `jsonwebtoken`: For creating and verifying JWTs
*   `bcryptjs`: For password hashing
*   `stripe`: Stripe Node.js library
*   `dotenv`: For loading environment variables
*   `cors`: For enabling Cross-Origin Resource Sharing
*   `validator`: For input validation (or similar library)

### Frontend (Likely existing):
*   `svelte`
*   `typescript`
*   `tailwindcss`
*   `vite`
*   `axios` or `fetch` API for HTTP requests

## 5. Technical Constraints & Considerations

*   **Security:** Robust input validation, secure password handling, protection against common web vulnerabilities (XSS, CSRF, etc.), and secure handling of payment information are paramount.
*   **Scalability:** While starting monolithic, design choices should consider future scalability needs.
*   **Error Handling:** Consistent and informative error handling across the backend.
*   **API Versioning:** Consider a strategy if significant API changes are anticipated in the future.
*   **Data Validation:** Implement thorough data validation at the API level.
