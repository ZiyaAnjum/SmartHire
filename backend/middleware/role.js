const AppError = require('../utils/AppError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized, login session required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role '${req.user.role}' is not authorized to access this resource. Required role: ${roles.join(' or ')}`,
          403
        )
      );
    }

    next();
  };
};

// Aliases for spec naming compliance
const requireRole = authorize;

module.exports = {
  authorize,
  requireRole,
};
