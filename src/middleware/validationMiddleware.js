const { validationResult } = require('express-validator');
const { ValidationError } = require('./errorMiddleware');

// Common validation rules
const commonRules = {
  email: {
    trim: true,
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Must be a valid email address'
  },
  password: {
    isLength: {
      min: 8,
      max: 100
    },
    matches: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    errorMessage: 'Password must be at least 8 characters long and include both letters and numbers'
  },
  databaseName: {
    matches: /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/,
    errorMessage: 'Database name must start with a letter and contain only alphanumeric characters and underscores'
  },
  tableName: {
    matches: /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/,
    errorMessage: 'Table name must start with a letter and contain only alphanumeric characters and underscores'
  }
};

// Helper to format validation errors
const formatValidationErrors = (errors) => {
  return errors.array().reduce((acc, error) => {
    if (!acc[error.param]) {
      acc[error.param] = [];
    }
    acc[error.param].push(error.msg);
    return acc;
  }, {});
};

// Main validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors);
    throw new ValidationError('Validation failed', formattedErrors);
  }
  next();
};

// SQL injection prevention middleware
const sanitizeSQLInput = (req, res, next) => {
  const dangerousPatterns = [
    /;.*;/i,          // Multiple statements
    /union.*select/i, // UNION-based injections
    /--/,            // SQL comments
    /\/\*/,          // Block comments
    /xp_.*cmd/i      // Stored procedure attacks
  ];

  const checkValue = (value) => {
    if (typeof value !== 'string') return true;
    return !dangerousPatterns.some(pattern => pattern.test(value));
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (!checkValue(obj[key])) {
        return false;
      }
      if (typeof obj[key] === 'object') {
        if (!checkObject(obj[key])) {
          return false;
        }
      }
    }
    return true;
  };

  if (!checkObject(req.body) || !checkObject(req.query)) {
    throw new ValidationError('Potential SQL injection detected');
  }

  next();
};

// Custom validator for ClickHouse queries
const validateClickHouseQuery = (query) => {
  const forbiddenKeywords = [
    'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'RENAME',
    'CREATE DATABASE', 'DROP DATABASE'
  ];

  return !forbiddenKeywords.some(keyword => 
    query.toUpperCase().includes(keyword)
  );
};

module.exports = {
  validateRequest,
  sanitizeSQLInput,
  validateClickHouseQuery,
  commonRules
};
