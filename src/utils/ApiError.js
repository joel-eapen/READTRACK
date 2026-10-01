/**
 * Standardized operational error.
 * Extends the native Error so it works with throw/next and stack traces,
 * while carrying an HTTP status code and optional field-level details.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of field-level error details
   */
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    // Marks errors we threw intentionally vs unexpected crashes
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience factories for common cases
  static badRequest(message = "Bad Request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
