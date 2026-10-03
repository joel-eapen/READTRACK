import { z } from "zod";

import ApiError from "../utils/ApiError.js";

const updateSchema = z.object({
    pagesRead:z
    .int("The page read should be a number")
    .min(0,"The minimum value of the pages read should be zero")
    .optional(),

    percentRead:z
    .int("The percent read should be a number")
    .min(0, "The percent read should be at least 0")
    .max(100, "The percent read should be at most 100")
    .optional(),

    status: z
    .enum(["finished", "current_read", "want_to_read"])
    .optional(),

    TotalPages: z
    .int()
    .min(0)
    .optional()
})

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

export const updateBook = validate(updateSchema);