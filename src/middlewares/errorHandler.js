import { ZodError } from "zod";

import ApiError from "../utils/ApiError.js";

/**
 * Global error-handling middleware.
 * Normalizes any error (ApiError, ZodError, Mongoose errors, or generic
 * Error) into a consistent JSON response shape.
 *
 * Must be registered LAST, after all routes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize non-ApiError errors into ApiError
  if (!(error instanceof ApiError)) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      error = new ApiError(400, "Validation failed", errors);
    } else if (error.name === "ValidationError") {
      // Mongoose validation error
      const errors = Object.values(error.errors || {}).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = new ApiError(400, "Validation failed", errors);
    } else if (error.name === "CastError") {
      // Mongoose invalid ObjectId, etc.
      error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
    } else {
      const statusCode = error.statusCode || error.status || 500;
      const message = error.message || "Internal Server Error";
      error = new ApiError(statusCode, message);
    }
  }

  // Log server-side (full stack for unexpected, message for operational)
  if (error.statusCode >= 500) {
    console.error(err.stack || err);
  } else {
    console.warn(`${error.statusCode} - ${error.message}`);
  }

  const payload = {
    success: false,
    message: error.message,
    errors: error.errors,
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV !== "production") {
    payload.stack = error.stack;
  }

  res.status(error.statusCode).json(payload);
};

export default errorHandler;
