import AppError from '../utils/AppError.js';

/**
 * Admin authorization middleware.
 * Must be used AFTER isAuth middleware.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  next();
};

export default isAdmin;
