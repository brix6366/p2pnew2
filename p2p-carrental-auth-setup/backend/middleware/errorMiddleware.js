// Basic Error Handling Middleware
// This can be expanded to handle different types of errors, log errors, etc.
const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR STACK:", err.stack); // Log error stack for debugging

  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  const message = err.message || 'Internal Server Error';

  // Send a structured error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Optionally, include stack in development mode
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
