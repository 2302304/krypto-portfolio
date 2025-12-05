const jwt = require('jsonwebtoken');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };

      next();

    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token on vanhentunut',
          code: 'TOKEN_EXPIRED'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Token ei ole validi',
        code: 'INVALID_TOKEN'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Ei valtuutusta - token puuttuu',
      code: 'NO_TOKEN'
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      // Just continue without user info
      console.log('Optional auth - invalid token, continuing without auth');
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
