const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');

// Authentication middleware for category controller
exports.authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      req.userId = decoded.userId; // Store the user ID in the request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error); // Log the token verification error
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};
