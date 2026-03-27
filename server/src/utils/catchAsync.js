/**
 * Wraps an async route handler to catch errors and pass to next().
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
