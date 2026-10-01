import { z } from "zod";

import ApiError from "../utils/ApiError.js";


export const bookSchema = z.object({
  externalId: z
  .string("The external Id should be a string")
  .min(1, "The external Id is required")
  .trim(),

  title: z
  .string("The title should be a string")
  .trim()
  .min(1,"The title is required"),

  author: z
    .string("The author should be string")
    .trim()
    .min(1,"The author is required"),

    coverImg: z
    .string("The coverImg should be a string")
    .url("The coverImg should be a valid URL")
    .trim()
    .optional(),

    isbn: z
    .string("The isbn number should be a string")
    .trim()
    .optional(),

    status: z
    .enum(["finished", "current_read", "want_to_read"])
    .default("want_to_read")
,
    totalPages: z
    .int("The total pages should be a number")
    .positive("The total pages should be a positive number"),

    pagesRead: z
    .int("The pages read should be a number")
    .min(0,"The number of pages read should be greater than or equal to 0")
    .default(0),

    percentRead: z
    .int("The percent read should be a number")
    .min(0, "The percent read should be at least 0")
    .max(100, "The percent read should be at most 100")
    .default(0),

    startedAt:z
    .date(),

    finishedAt: z
    .date()
    .optional()



});

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


export const validateBook = validate(bookSchema);
