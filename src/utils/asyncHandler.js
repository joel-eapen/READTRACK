/**
 * Wraps an async route handler so any rejected promise is forwarded
 * to Express's error-handling middleware via next(). Removes the need
 * for repetitive try/catch blocks in controllers.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function} wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
