const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smarthire_jwt_secret_key');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new AppError('Not authorized, user account no longer exists', 401));
      }

      return next();
    } catch (error) {
      return next(new AppError('Not authorized, token validation failed', 401));
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, please provide a valid Bearer token', 401));
  }
};

// Aliases for spec naming compliance
const verifyToken = protect;

module.exports = {
  protect,
  verifyToken,
};
