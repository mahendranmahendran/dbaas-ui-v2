const rateLimit = require('express-rate-limit');

// Define rate limit configurations for different endpoints
const limiters = {
  // Auth endpoints - stricter limits to prevent brute force
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 attempts per 15 minutes
    message: {
      error: 'Too many authentication attempts',
      details: 'Please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // API endpoints - general purpose limit
  api: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
      error: 'Rate limit exceeded',
      details: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Query execution - specific limit for database queries
  query: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 queries per minute
    message: {
      error: 'Query rate limit exceeded',
      details: 'Too many database queries, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Backup operations - very limited due to resource intensity
  backup: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 backup operations per hour
    message: {
      error: 'Backup operation limit exceeded',
      details: 'Too many backup requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
};

// Helper to get the appropriate limiter
const getRateLimiter = (type = 'api') => {
  return limiters[type] || limiters.api;
};

module.exports = {
  authLimiter: limiters.auth,
  apiLimiter: limiters.api,
  queryLimiter: limiters.query,
  backupLimiter: limiters.backup,
  getRateLimiter
};
