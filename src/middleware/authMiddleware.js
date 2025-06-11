const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errorMiddleware');

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

const validateToken = (token, type = TOKEN_TYPES.ACCESS) => {
  try {
    const secret = type === TOKEN_TYPES.REFRESH 
      ? process.env.JWT_REFRESH_SECRET 
      : process.env.JWT_SECRET;
    
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
};

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }

    const decoded = validateToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId,
      permissions: decoded.permissions || []
    };

    // Add token expiration check
    const tokenExp = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExp = tokenExp - currentTime;

    // If token is close to expiring (less than 5 minutes), add refresh header
    if (timeUntilExp < 5 * 60 * 1000) {
      res.set('X-Token-Refresh', 'true');
    }

    next();
  } catch (error) {
    next(error);
  }
};

const refreshTokenMiddleware = (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    const decoded = validateToken(refreshToken, TOKEN_TYPES.REFRESH);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Generate both access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      permissions: user.permissions
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  authMiddleware,
  refreshTokenMiddleware,
  generateTokens,
  TOKEN_TYPES
};
