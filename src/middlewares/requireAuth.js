import { getAuth } from "@clerk/express";

import ApiError from "../utils/ApiError.js";
import userModel from "../models/user.model.js";

/**
 * Auth guard for API routes.
 * Reads Clerk auth state (populated by clerkMiddleware) via getAuth().
 * If the request is not authenticated, forwards a 401 ApiError to the
 * global error handler so the client receives a consistent JSON response
 * (rather than Clerk's default sign-in redirect, which suits SSR apps).
 */
const requireAuth = async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new ApiError(401, "Unauthorized: authentication required"));
  }

  let user = await userModel.findOne({
    clerkUserId: userId,
  });

  if (!user || user === null) {
    user = await userModel.create({
      clerkUserId: userId,
    });
  }

  req.user = user;

  next();
};

export default requireAuth;
