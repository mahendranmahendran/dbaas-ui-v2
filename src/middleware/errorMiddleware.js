const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Define error types and their corresponding status codes
  const errorTypes = {
    ValidationError: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    NotFoundError: 404,
    ClickHouseError: 400,
    RateLimitError: 429,
    DatabaseError: 503
  };

  // Get status code based on error type or default to 500
  const statusCode = errorTypes[err.name] || 500;

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      return res.status(statusCode).json({
        error: 'Validation Error',
        details: err.errors || err.message
      });

    case 'UnauthorizedError':
      return res.status(statusCode).json({
        error: 'Unauthorized',
        details: 'Invalid or expired token'
      });

    case 'ForbiddenError':
      return res.status(statusCode).json({
        error: 'Forbidden',
        details: 'Insufficient permissions'
      });

    case 'ClickHouseError':
      return res.status(statusCode).json({
        error: 'Database Error',
        details: err.message,
        query: err.query // Include failed query for debugging
      });

    case 'RateLimitError':
      return res.status(statusCode).json({
        error: 'Rate Limit Exceeded',
        details: err.message,
        retryAfter: err.retryAfter // Include retry-after information
      });

    default:
      // Default error response
      return res.status(statusCode).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' 
          ? err.message 
          : 'An unexpected error occurred'
      });
  }
};

// Error types for consistent error handling
class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class ClickHouseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'ClickHouseError';
    this.query = query;
  }
}

class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

module.exports = {
  errorHandler,
  ValidationError,
  ForbiddenError,
  ClickHouseError,
  RateLimitError
};
