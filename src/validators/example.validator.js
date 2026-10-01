import { z } from "zod";

import ApiError from "../utils/ApiError.js";

/**
 * Zod schema for the example resource.
 * Define the expected shape and constraints of incoming data here.
 */
export const exampleSchema = z.object({
  name: z
    .string({ error: "'name' is required and must be a string" })
    .trim()
    .min(1, "'name' cannot be empty"),
});

/**
 * Reusable validation middleware factory.
 * Pass any zod schema and the request body is validated against it.
 * On success, req.body is replaced with the parsed/sanitized data.
 * On failure, forwards a structured ApiError to the global error handler.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(new ApiError(400, "Validation failed", errors));
  }

  req.body = result.data;
  next();
};

/**
 * Convenience middleware specific to the example resource.
 */
export const validateExample = validate(exampleSchema);
